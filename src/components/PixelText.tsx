import { Typography, TypographyProps, styled } from '@mui/material';

const PixelTypography = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
});

export const PixelText = (props: TypographyProps) => {
    return <PixelTypography {...props} />;
}; 