// src/pages/admin/Dashboard.jsx
import React, { useState } from "react";
import SummaryCards from "../../components/admin/SummaryCards";
import UserTable from "../../components/admin/UserTable";

export default function Dashboard({ userInfo }) {
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAction = () => setRefreshKey(prev => prev + 1);

    if (!userInfo) return null;

    return (
        <div className="flex flex-col flex-1 p-6 space-y-6">
            {userInfo.rol === "admin" ? (
                <>
                    <SummaryCards refreshKey={refreshKey} onFilter={setFilter} />
                    <UserTable filter={filter} onAction={handleAction} />
                </>
            ) : (
                <div className="text-center text-2xl">
                    ¡Bienvenido al Dashboard de Cliente!
                </div>
            )}
        </div>
    );
}
