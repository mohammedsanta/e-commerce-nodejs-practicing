const express = require('express');
const { createFilterObj, getReview, setProductIdAndUserIdToBody, createReview, updateReview, deleteReview } = require('../services/reviewService');

const authService = require('../services/authService');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObj,getReview)
    .post(
        authService.protect,
        authService.allowTo('user'),
        setProductIdAndUserIdToBody,
        createReviewValidator,
        createReview,
    );

router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        authService.protect,
        authService.allowTo('user'),
        updateReviewValidator,
        updateReview,
    )
    .delete(
        authService.protect,
        authService.allowTo(['user','manager','admin']),
        deleteReviewValidator,
        deleteReview,
    );


module.exports = router;