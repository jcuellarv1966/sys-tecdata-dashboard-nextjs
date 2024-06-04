import React from 'react';
import Layout from "../../components/Layout";
import SideNavbarAdvisory from "../../components/SideNavbarAdvisory";

export default function DashboardAdvisory() {
    return (
        <Layout title="Advisory Dashboard">
            <div className="grid md:grid-cols-8 md:gap-1 mt-4">
                <div>
                    <SideNavbarAdvisory />
                </div>
                <div className="overflow-x-auto md:col-span-7 ml-12">
                    <div>Advisory Dashboard</div>
                </div>
            </div>
        </Layout>
    )
}

DashboardAdvisory.auth = { adminOnly: true };