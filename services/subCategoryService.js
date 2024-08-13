

exports.setCategoryIdToBody = (req,res,next) => {
    // Nested route (Create)
    if (!req.body.categoryId) req.body.categoryId = req.params.categoryId;
    next();
}

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req,res,next) => {
    let filterObj = {};
    if(req.params.categoryId) filterObj = { category: req.params.categoryId };
    req.filterObj = filterObj;
    next();
};

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);