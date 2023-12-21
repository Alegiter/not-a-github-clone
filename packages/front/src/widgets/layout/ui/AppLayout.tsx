import { Box, Divider, Stack } from "@mui/material"
import { memo } from "react"
import { Outlet } from "react-router-dom"
import { SearchInputUi } from "~/features/search"

export const AppLayout = memo(function AppLayout() {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ minWidth: "16rem", maxWidth: "16rem" }}>
                <Stack
                    divider={<Divider />}
                >
                    <Box sx={{padding: "1rem"}}>
                        <SearchInputUi />
                    </Box>
                    <Outlet context="sidebar" />
                </Stack>
            </Box>
            <Divider flexItem orientation="vertical" />
            <Box sx={{ flex: 1 }}>
                <Outlet context="main" />
            </Box>
        </Box >
    )
})