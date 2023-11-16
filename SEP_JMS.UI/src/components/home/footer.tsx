import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
// import { FooterNavigation, FooterSocialLinks } from '@/components/footer'

const Footer: FC = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: 'primary.main', py: { xs: 6, md: 10 }, color: 'primary.contrastText' }}
    >
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5}>
            <Box sx={{ width: { xs: '100%', md: 360 }, mb: { xs: 3, md: 0 } }}>
              <Typography variant="subtitle1">
                JMS @ Capstone Project
              </Typography>
              <Typography variant="subtitle2" sx={{ letterSpacing: 1, mb: 2 }}>
                Capstone Project # FPT University
              </Typography>
              {/* <FooterSocialLinks /> */}
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            {/* <FooterNavigation /> */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
