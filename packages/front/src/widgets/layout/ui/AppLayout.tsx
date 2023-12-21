import { Box } from "@mui/material"
import { memo } from "react"
import { Outlet } from "react-router-dom"

export const AppLayout = memo(function AppLayout() {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ minWidth: "16rem", maxWidth: "16rem" }}>
                <Outlet context="sidebar" />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Outlet context="main" />
            </Box>
        </Box >
    )
})