/**
 * @jest-environment jsdom
 */

import { Slider } from "../../src/components/slider/slider"

test('slider.constructor', () => {
    const slider = new Slider(['img1', 'img2', 'img3']);
    const imgCount =  slider.getComponent().querySelectorAll('.slider__card').length;

    expect(imgCount).toBe(3);

    const controls = slider.getComponent().querySelector('.slider__controls');
    expect(controls).toBeTruthy();

    const numCount = (controls as HTMLElement).querySelectorAll('.slider__number').length;
    expect(numCount).toBe(3);
  }
);

test('slider.getNumber', () => {
  const slider = new Slider(['img1', 'img2', 'img3', 'img4']);
  expect(slider.getCurrentNumber()).toBe(1);
  
  //slider.setToNumber(3);
  //expect(slider.getCurrentNumber()).toBe(3);

  //const slideId = (slider.getComponent().querySelector('.slider__number_current') as HTMLElement).dataset.id;
  //expect(slideId).toBe(3);
});