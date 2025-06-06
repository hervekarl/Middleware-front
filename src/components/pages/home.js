import React, { useEffect } from 'react';
import logologin from "../../images/loginlogo.png";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const HomePage = () => {
    useEffect(() => {
        console.log('Home page mounted');
        console.log('Current token:', localStorage.getItem('authToken'));
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            {/* En-tête */}
            <div className="bg-blue-800 w-full py-3 text-white font-bold text-center sticky top-0 z-10">
                <h1 className="text-lg md:text-xl">Home Page</h1>
            </div>

            {/* Grille responsive améliorée */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-slate-600'>
                {[...Array(8)].map((_, index) => (
                    <Card key={index} sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={logologin}
                            alt={`Card ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                Card Title {index + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description for card {index + 1}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <CardActions>
                                <Button className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                                    More
                                </Button>
                            </CardActions>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default HomePage;