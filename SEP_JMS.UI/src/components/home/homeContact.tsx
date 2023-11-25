import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Button, InputBase } from '@mui/material'
// import { FooterNavigation, FooterSocialLinks } from '@/components/footer'

const HomeContact: FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.paper', py: { xs: 8, md: 10 } }}>
      <Container>
        <Box
          sx={{
            backgroundColor: '#ffaf35',
            borderRadius: 10,
            py: { xs: 4, md: 10 },
            px: { xs: 4, md: 8 },
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
            Liên hệ ngay với chúng tôi
          </Typography>
          <Typography sx={{ mb: 6 }}>Liên hệ ngay với chúng tôi để làm việc cùng những nhà thiết kế hàng đầu.</Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-around',
              width: { xs: '100%', md: 560 },
              mx: 'auto',
            }}
          >
            
            <Box>
              <Button variant="outlined" onClick={()=>window.open("https://zalo.me/84968686868")}>
                Liên hệ qua Zalo
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HomeContact

