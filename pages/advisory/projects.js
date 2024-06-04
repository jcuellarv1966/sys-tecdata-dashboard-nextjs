import React from 'react';
import Layout from "../../components/Layout";
import SideNavbarAdvisory from "../../components/SideNavbarAdvisory";

export default function AdminProjectsScreen() {
    return (
        <Layout title="Admin Projects">
            <div className="grid md:grid-cols-8 md:gap-1 mt-4">
                <div>
                    <SideNavbarAdvisory />
                </div>
                <div className="overflow-x-auto md:col-span-7 ml-12">
                    <div>Projects</div>
                </div>
            </div>
        </Layout>
    )
}

AdminProjectsScreen.auth = { adminOnly: true };