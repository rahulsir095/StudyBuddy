require("dotenv").config();
import { Response } from 'express';
import { redis } from './redis';

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "none",
    secure:true,
}

// Parse environment variables properly
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure:true,
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure:true,
};

export const sendToken = async (user: any, statusCode: number, res: Response) => {

    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Store session in Upstash Redis with expiry (refreshTokenExpire in days)
    await redis.set(
        user._id.toString(),
        JSON.stringify(user),
        { ex: refreshTokenExpire * 24 * 60 * 60 }
    );

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
        maxAge: accessTokenExpire * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure:true,
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
        maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure:true,
    };

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
    });
};
