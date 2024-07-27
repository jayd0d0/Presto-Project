import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
// import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PresentationList = ({ store }) => {
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    if (store.presentations !== undefined) {
      setLoading(false); // Set loading to false once presentations are available
    }
  }, [store.presentations]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (store.presentations === undefined) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render the rest of the component
  return (
    <Grid container marginBlock={1} spacing={2}>
      {store.presentations.map((presentation, index) => {
        const numSlides = presentation.slides.length;
        const title = presentation.title;
        const description = presentation.description;
        const thumbnail = presentation.thumbnail;
        const presentationId = presentation.presentationId;
        return (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Link
              to={`/edit/${presentationId}/1`}
              style={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="180"
                    src={thumbnail}
                    alt={`${title} thumbnail`}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textDecoration: 'none' }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'none' }}
                    >
                      Description: {description} <br />
                      Number of Slides: {numSlides}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PresentationList;
