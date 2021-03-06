// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1- Get All Tours data from the collection
  const tours = await Tour.find();

  // 2-Build template (built overview.pug)
  // 3-Render  that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1 Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // 2 Build the template (built tour.pug)

  // 3 Render template
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login To Your Account',
  });
};
exports.getAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'My Account',
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all Bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned Ids
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'My Account',
    user: updatedUser,
  });
});
