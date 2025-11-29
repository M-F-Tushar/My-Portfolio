import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Proxy to backend RAG endpoint
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const response = await axios.post(
            `${backendUrl}/api/query`,
            {
                query: message,
                history: conversationHistory,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        return res.status(200).json(response.data);
    } catch (error: any) {
        console.error('Chat API error:', error.message);

        // Fallback response if backend is unavailable
        return res.status(200).json({
            response: "I'm currently running in offline mode. The backend service is not available, but you can still explore the demo with precomputed responses. Try asking about RAG systems, LLMs, or AI agents!",
            sources: [],
            offline: true,
        });
    }
}
