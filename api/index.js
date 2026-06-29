// ============================================
// subscriber-api.js - Newsletter Subscriber API
// Standalone | Toggle Subscribe/Unsubscribe
// ============================================

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// HELPER FUNCTION
// ============================================
function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return email && emailRegex.test(email);
}

// ============================================
// POST - Subscribe/Unsubscribe Toggle
// ============================================
router.post('/subscribe', async (req, res) => {
    try {
        const { email, name } = req.body;

        // Validate email
        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanName = name ? name.trim() : '';

        // Check if email already exists
        const { data: existing, error: checkError } = await supabase
            .from('subscribers')
            .select('id, email, name, is_active')
            .eq('email', cleanEmail)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        // CASE 1: Already subscribed -> Unsubscribe (delete old, insert new inactive)
        if (existing && existing.is_active) {
            const { error: deleteError } = await supabase
                .from('subscribers')
                .delete()
                .eq('id', existing.id);

            if (deleteError) throw deleteError;

            const { data: unsubscribed, error: insertError } = await supabase
                .from('subscribers')
                .insert([{
                    email: cleanEmail,
                    name: cleanName || existing.name,
                    is_active: false,
                    subscribed_at: existing.subscribed_at || new Date().toISOString(),
                    unsubscribed_at: new Date().toISOString()
                }])
                .select('id, email, name, is_active, subscribed_at, unsubscribed_at')
                .single();

            if (insertError) throw insertError;

            return res.status(200).json({
                success: true,
                message: 'Successfully unsubscribed',
                is_subscribed: false,
                data: unsubscribed
            });
        }

        // CASE 2: Was unsubscribed -> Re-subscribe (delete old, insert new active)
        if (existing && !existing.is_active) {
            const { error: deleteError } = await supabase
                .from('subscribers')
                .delete()
                .eq('id', existing.id);

            if (deleteError) throw deleteError;

            const { data: reactivated, error: insertError } = await supabase
                .from('subscribers')
                .insert([{
                    email: cleanEmail,
                    name: cleanName || existing.name,
                    is_active: true,
                    subscribed_at: new Date().toISOString(),
                    unsubscribed_at: null
                }])
                .select('id, email, name, is_active, subscribed_at, unsubscribed_at')
                .single();

            if (insertError) throw insertError;

            return res.status(200).json({
                success: true,
                message: 'Successfully re-subscribed',
                is_subscribed: true,
                data: reactivated
            });
        }

        // CASE 3: New subscriber -> Subscribe
        const { data: newSubscriber, error: insertError } = await supabase
            .from('subscribers')
            .insert([{
                email: cleanEmail,
                name: cleanName,
                is_active: true,
                subscribed_at: new Date().toISOString()
            }])
            .select('id, email, name, is_active, subscribed_at, unsubscribed_at')
            .single();

        if (insertError) {
            if (insertError.code === '23505') {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            throw insertError;
        }

        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            is_subscribed: true,
            data: newSubscriber
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process subscription',
            error: error.message
        });
    }
});

// ============================================
// GET - Check subscription status
// ============================================
router.get('/status', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        const { data: subscriber, error } = await supabase
            .from('subscribers')
            .select('id, email, name, is_active, subscribed_at, unsubscribed_at')
            .eq('email', cleanEmail)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(200).json({
                    success: true,
                    is_subscribed: false,
                    message: 'Email is not subscribed'
                });
            }
            throw error;
        }

        return res.status(200).json({
            success: true,
            is_subscribed: subscriber.is_active,
            data: subscriber
        });

    } catch (error) {
        console.error('Status check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check subscription status',
            error: error.message
        });
    }
});

// ============================================
// GET - Total active subscriber count
// ============================================
router.get('/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            total_active_subscribers: count
        });

    } catch (error) {
        console.error('Count error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get subscriber count',
            error: error.message
        });
    }
});

module.exports = router;
