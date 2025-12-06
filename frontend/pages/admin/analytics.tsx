/**
 * Admin Analytics Page
 * Displays comprehensive analytics dashboard for portfolio insights
 */
import { GetServerSideProps } from 'next';
import AdminLayout from '../../components/AdminLayout';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import SEO from '../../components/SEO';

export default function AdminAnalyticsPage() {
    return (
        <AdminLayout>
            <SEO 
                title="Analytics Dashboard | Admin"
                description="Portfolio analytics and insights"
                noIndex={true}
            />
            <div className="p-6">
                <AnalyticsDashboard />
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies?.token;

    if (!token) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
