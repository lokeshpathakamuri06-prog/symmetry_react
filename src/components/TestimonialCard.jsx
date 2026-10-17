import React from 'react';
import { Star, Quote } from 'lucide-react';
import { m } from 'framer-motion';
import { reveal } from '../lib/motion';

import AppleCardWrapper from './AppleCardWrapper';
import SmartImage from './SmartImage';

export const TestimonialCard = ({ testimonial }) => {
  return (
    <m.div
      {...reveal()}
      className="h-full"
    >
      <AppleCardWrapper className="p-8 sm:p-10 rounded-3xl bg-surface flex flex-col justify-between relative h-full">
        <Quote className="w-8 h-8 text-accent/20 absolute top-6 right-6" />

        <div>
          {/* 5-star rating */}
          <div className="flex items-center gap-1 mb-6 text-accent">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-lg sm:text-xl text-fg font-normal leading-relaxed italic mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>

        {/* Author Details */}
        <div className="flex items-center gap-3 pt-6">
          <SmartImage sizes="96px"
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-11 h-11 rounded-full object-cover shadow-sm"
          />
          <div>
            <h4 className="text-sm font-medium text-fg">
              {testimonial.author}
            </h4>
            <p className="text-xs text-accent">
              {testimonial.role} &bull; {testimonial.project}
            </p>
            <p className="text-[11px] text-muted">
              {testimonial.location}
            </p>
          </div>
        </div>
      </AppleCardWrapper>
    </m.div>
  );
};

export default TestimonialCard;
