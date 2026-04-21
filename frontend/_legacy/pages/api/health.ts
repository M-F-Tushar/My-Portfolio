/**
 * Health Check API Endpoint
 * Returns system status for uptime monitoring
 * 
 * Usage:
 * - Uptime monitoring services (UptimeRobot, Pingdom, etc.)
 * - Load balancer health checks
 * - Container orchestration (Kubernetes, Docker Swarm)
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    uptime: number;
    checks: {
        database: {
            status: 'up' | 'down';
            latency?: number;
            error?: string;
        };
        memory: {
            status: 'ok' | 'warning' | 'critical';
            used: number;
            total: number;
            percentage: number;
        };
    };
}

// Track server start time for uptime calculation
const startTime = Date.now();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HealthStatus>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const checks: HealthStatus['checks'] = {
        database: { status: 'down' },
        memory: { status: 'ok', used: 0, total: 0, percentage: 0 },
    };

    let overallStatus: HealthStatus['status'] = 'healthy';

    // Check database connectivity
    const dbStart = Date.now();
    try {
        // Simple query to check database connection
        await prisma.$queryRaw`SELECT 1`;
        checks.database = {
            status: 'up',
            latency: Date.now() - dbStart,
        };
    } catch (error) {
        checks.database = {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown database error',
        };
        overallStatus = 'unhealthy';
    }

    // Check memory usage (Node.js specific)
    const memoryUsage = process.memoryUsage();
    const usedMemory = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMemory = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    checks.memory = {
        status: memoryPercentage > 90 ? 'critical' : memoryPercentage > 75 ? 'warning' : 'ok',
        used: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage,
    };

    if (checks.memory.status === 'critical') {
        overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus;
    }

    // Calculate uptime
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    // Build response
    const healthStatus: HealthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        uptime,
        checks,
    };

    // Set appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    // Set cache headers (don't cache health checks)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(statusCode).json(healthStatus);
}
