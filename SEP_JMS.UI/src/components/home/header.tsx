import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
// import { Logo } from '@/components/logo'
// import { Navigation, AuthNavigation } from '@/components/navigation'
import { useTheme } from '@mui/material/styles'
import { Menu, Close } from '@mui/icons-material'
import Images from '../../img'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PathString } from '../../enums/MapRouteToBreadCrumb'

const Header: FC = () => {
    const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
    const { breakpoints } = useTheme()
    const matchMobileView = useMediaQuery(breakpoints.down('md'))
    const navigate = useNavigate()

    return (
        <Box sx={{ backgroundColor: 'background.paper' }}>
            <Container sx={{ py: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* <Logo /> */}
                    <img

                        src={Images.logo}
                        className="w-28 cursor-pointer transition-all hover:opacity-70"
                        alt=""
                    />
                    <Box sx={{ ml: 'auto', display: { xs: 'inline-flex', md: 'none' } }}>
                        <IconButton onClick={() => setVisibleMenu(!visibleMenu)}>
                            <Menu />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', md: 'row' },

                            transition: (theme) => theme.transitions.create(['top']),
                            ...(matchMobileView && {
                                py: 6,
                                backgroundColor: 'background.paper',
                                zIndex: 'appBar',
                                position: 'fixed',
                                height: { xs: '100vh', md: 'auto' },
                                top: visibleMenu ? 0 : '-120vh',
                                left: 0,
                            }),
                        }}
                    >
                        <Box /> {/* Magic space */}
                        {/* <Navigation /> */}
                        {/* AuthNavigation */}
                        <Box sx={{ '& button:first-child': { mr: 2 } }}>
                            <Button variant="outlined"
                                onClick={() => {
                                    navigate(`/${PathString.DANG_NHAP}`)
                                }}
                            >
                                Đăng nhập
                            </Button>
                            {/* <Button >Sign Up</Button> */}
                        </Box>
                        {visibleMenu && matchMobileView && (
                            <IconButton
                                sx={{
                                    position: 'fixed',
                                    top: 10,
                                    right: 10,
                                }}
                                onClick={() => setVisibleMenu(!visibleMenu)}
                            >
                                <Close />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Header
