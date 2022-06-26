const express = require('express');
// const app = require('../app');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// router.param('id', tourController.checkId);

// POST /tour/4273542/reviews
// GET /tour/4273542/reviews
// POST /tour/4273542/reviews/278632367217678
router.use('/:tourId/reviews', reviewRouter);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').all(tourController.getTourStats);
router.route('/tour-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
