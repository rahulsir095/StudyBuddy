import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import layoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
//create layout
export const createLayout = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { type } = req.body;
         const isTypeExist = await layoutModel.findOne({ type });
         if (isTypeExist) {
            return next(new ErrorHandler(`${type} is already exists.`, 500));
         }
         if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const mycloud = await cloudinary.v2.uploader.upload(image, {
               folder: "Layout",
            });
            const banner = {
               type: "Banner",
               banner: {
                  image: {
                     public_id: mycloud.public_id,
                     url: mycloud.secure_url,
                  },
                  title,
                  subTitle,
               },
            };
            await layoutModel.create(banner);
         }
         if (type === "FAQ") {
            console.log("Ok");
            const { faq } = req.body;
            const faqItems = await Promise.all(
               faq.map(async (item: any) => {
                  return {
                     question: item.question,
                     answer: item.answer,
                  };
               })
            );
            await layoutModel.create({ type: "FAQ", faq: faqItems });
         }
         if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(
               categories.map(async (item: any) => {
                  return {
                     title: item.title,
                  };
               })
            );
            await layoutModel.create({
               type: "Categories",
               categories: categoriesItems,
            });
         }

         res.status(200).json({
            success: true,
            message: "Layout Created Successfullly",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// edit layout
export const editLayout = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { type } = req.body;

         if (type === "Banner") {
            const bannerData: any = await layoutModel.findOne({
               type: "Banner",
            });
            if (!bannerData) {
               return next(new ErrorHandler("Banner layout not found", 404));
            }

            let { image, title, subTitle } = req.body;

            if (image && !image.startsWith("http")) {
               // Destroy old image if exists
               if (bannerData.image?.public_id) {
                  await cloudinary.v2.uploader.destroy(
                     bannerData.image.public_id
                  );
               }

               const mycloud = await cloudinary.v2.uploader.upload(image, {
                  folder: "Layout",
               });

               image = {
                  public_id: mycloud.public_id,
                  url: mycloud.secure_url,
               };
            } else if (image && image.startsWith("http")) {
               // Keep old image structure if only URL is passed
               image = bannerData.banner.image;
            }
            await layoutModel.findByIdAndUpdate(bannerData._id, {
               banner: {
                  image,
                  title,
                  subTitle,
               },
               
            },{ new: true });
         }

         if (type === "FAQ") {
            const { faq = [] } = req.body;
            const faqItem: any = await layoutModel.findOne({ type: "FAQ" });

            if (!faqItem) {
               return next(new ErrorHandler("FAQ layout not found", 404));
            }

            const faqItems = faq.map((item: any) => ({
               question: item.question,
               answer: item.answer,
            }));

            await layoutModel.findByIdAndUpdate(faqItem._id, {
               faq: faqItems,
            });
         }

         if (type === "Categories") {
            const { categories = [] } = req.body;
            const categoriesData: any = await layoutModel.findOne({
               type: "Categories",
            });

            if (!categoriesData) {
               return next(
                  new ErrorHandler("Categories layout not found", 404)
               );
            }

            const categoriesItems = categories.map((item: any) => ({
               title: item.title,
            }));

            await layoutModel.findByIdAndUpdate(categoriesData._id, {
               categories: categoriesItems,
            });
         }

         res.status(200).json({
            success: true,
            message: "Layout Updated Successfully",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//get layout by type
export const getLayoutByType = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { type } = req.params;
         const layout = await layoutModel.findOne({ type });
         res.status(200).json({
            success: true,
            layout,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
