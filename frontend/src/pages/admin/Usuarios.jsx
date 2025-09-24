// src/pages/admin/Usuarios.jsx
import React, { useState } from "react";
import SummaryCards from "@/components/admin/SummaryCards";
import UserTable from "@/components/admin/UserTable";

export default function Usuarios() {
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAction = () => setRefreshKey(prev => prev + 1);

    return (
        <div className="flex flex-col flex-1 p-6 space-y-6">
            <SummaryCards refreshKey={refreshKey} onFilter={setFilter} />
            <UserTable filter={filter} onAction={handleAction} />
        </div>
    );
}
