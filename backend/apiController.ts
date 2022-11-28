import asyncHandler from "express-async-handler";

export const getAllParts = asyncHandler(async (req, res) => {
    res.send("Part");
});

export const editPart = asyncHandler(async (req, res) => {
    res.send("Edit");
});
