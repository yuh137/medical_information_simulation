import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import IntroDivider from '../../IntroDivider';
import { Admin, Student } from '../../../util/indexedDB/IDBSchema';
import { getAccountData } from '../../../util/indexedDB/getData';



//Grab name from one of the account tables
async function fetchUserName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.firstname}`;
  }
  return 'doos';
}

//Grab name from one of the account tables
async function fetchUserType(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.type}`;
  }
  return 'Not registered as student or admin';
}

const cardData = [
  //Description of card Data changes for faculty
  {
    img: 'https://i.imgur.com/vLTX91C.png',
    title: 'Quality Controls',
    description:
      'Order or review quality control panels for different Analytes',
  },
  {
    img: 'https://picsum.photos/800/450?random=1',
    title: 'Quizzes',
    description:
      'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
  },

];

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  //margin changes the size of the card
  margin: '5%',
  backgroundColor: (theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search for QC Report"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

function capitalizeFirstLetter(val: string) {
  return (val).charAt(0).toUpperCase() + (val).slice(1);
}

export default function MainContent() {
  const [userName, setUserName] = useState<string>('User');
  const [userType, setUserType] = useState<string>('Type');
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

    // Fetch the user's name from IndexedDB on component mount
    useEffect(() => {
      async function fetchName() {
        const name = await fetchUserName();
        setUserName(name);
      }
      fetchName();
      async function fetchType() {
        const user_type = await fetchUserType();
        setUserType(user_type);
      }
      fetchType();
    }, []);
  
  const capitalizedType = capitalizeFirstLetter(userType)


  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Welcome, {userName}!
        </Typography>
        <Typography>MIS Learning Information System and Quality Control Dashboards<br></br>Texas Health Sciences Center - {capitalizedType} Portal</Typography>
      </div>

      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Link to="/orderentries" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Chip onClick={handleClick} size="medium" label="In Progress QC Reports" />
          </Link>

          <Link to="/viewqcresults" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Chip
              onClick={handleClick}
              size="medium"
              label="Finished QC Reports"
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          </Link>

          <Link to="/reportsubmissions" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Chip
              onClick={handleClick}
              size="medium"
              label="Report Submission Page"
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          </Link>

          <Link to="/gradebook" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Chip
              onClick={handleClick}
              size="medium"
              label="Grade Book"
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          </Link>

          <Link to="/patientreports" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Chip
              onClick={handleClick}
              size="medium"
              label="Patient Reports"
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
            />
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Search />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} columns={12}>
      
        {/*Card 1*/}
        <Grid size={{ xs: 12, md: 6 }}>
          <Link to="/qc" style={{ textDecoration: 'none', color: 'inherit' }}>     
          <StyledCard
            variant="outlined"
            onFocus={() => handleFocus(0)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              image={cardData[0].img}
              sx={{
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <StyledCardContent>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[0].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[0].description}
              </StyledTypography>
            </StyledCardContent>
          </StyledCard>
          </Link>
        </Grid>
        
        {/*Card 2*/}
        <Grid size={{ xs: 12, md: 6 }}>
          <IntroDivider></IntroDivider>

        </Grid>
        {/*End of cards*/}
      </Grid>
    </Box>
  );
}
