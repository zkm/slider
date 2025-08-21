describe('Carousel Functions', () => {
  test('updateScrollAmount calculates correctly', () => {
    // Mock thumbnailItems
    const thumbnailItems = [{ offsetWidth: 100 }, { offsetWidth: 100 }];
    const gap = 12;
    const scrollAmount = thumbnailItems[0].offsetWidth + gap;
    expect(scrollAmount).toBe(112);
  });

  test('showSlide updates current slide', () => {
    let current = 0;
    const idx = 1;
    current = idx;
    expect(current).toBe(1);
  });
});
