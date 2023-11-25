import React, { ReactNode } from 'react'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'

interface Data {
  title: string
  description: string
  icon?: ReactNode
}

export const data: Data[] = [
  {
    title: 'Trainer',
    description: 'TamNT',
    icon: <ArtTrackIcon />,
  },
  {
    title: 'Team Leader',
    description: 'TuanTX',
    icon: <AttachMoneyIcon />,
  },
  {
    title: 'Developer',
    description: 'MinhNN',
    icon: <LocalLibraryIcon />,
  },
  {
    title: 'Developer',
    description: 'ThaiNV',
    icon: <LocalLibraryIcon />,
  },
  {
    title: 'Developer',
    description: 'VinhCV',
    icon: <LocalLibraryIcon />,
  },
  {
    title: 'Tester',
    description: 'PhuongNT',
    icon: <LocalLibraryIcon />,
  },
  
]
