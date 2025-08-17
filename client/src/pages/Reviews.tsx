import React, { useState } from 'react';
import { Search, Star, Reply, Send } from 'lucide-react';
import { reviews } from '../data/mockData';
import { Review } from '../types';

const Reviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewList, setReviewList] = useState<Review[]>(reviews);
  const [responseText, setResponseText] = useState<{ [key: number]: string }>({});

  const filteredReviews = reviewList.filter(review =>
    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResponseSubmit = (reviewId: number) => {
    const response = responseText[reviewId];
    if (response && response.trim()) {
      setReviewList(prev => prev.map(review =>
        review.id === reviewId ? { ...review, adminResponse: response } : review
      ));
      setResponseText(prev => ({ ...prev, [reviewId]: '' }));
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 p-6">
      <div className="flex items-start space-x-4">
        <img
          src={review.userImage}
          alt={review.userName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{review.userName}</h3>
              <p className="text-sm text-gray-500">{review.productName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} />
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>
          
          {review.adminResponse ? (
            <div className="bg-maroon-50 border border-maroon-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-maroon-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Reply className="text-white" size={12} />
                </div>
                <div>
                  <p className="text-sm font-medium text-maroon-800 mb-1">Admin Response:</p>
                  <p className="text-sm text-maroon-700">{review.adminResponse}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Response:
              </label>
              <div className="flex space-x-2">
                <textarea
                  value={responseText[review.id] || ''}
                  onChange={(e) => setResponseText(prev => ({
                    ...prev,
                    [review.id]: e.target.value
                  }))}
                  placeholder="Write your response to this review..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 resize-none"
                  rows={2}
                />
                <button
                  onClick={() => handleResponseSubmit(review.id)}
                  disabled={!responseText[review.id]?.trim()}
                  className="px-4 py-2 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                >
                  <Send size={16} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const averageRating = reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Manage customer feedback and responses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{reviewList.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                <StarRating rating={Math.round(averageRating)} />
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="text-yellow-600 fill-current" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Responses</p>
              <p className="text-3xl font-bold text-red-600">
                {reviewList.filter(review => !review.adminResponse).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Reply className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Responded</p>
              <p className="text-3xl font-bold text-green-600">
                {reviewList.filter(review => review.adminResponse).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Send className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search reviews by customer name, product, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No reviews found matching your search criteria</div>
        </div>
      )}
    </div>
  );
};

export default Reviews;