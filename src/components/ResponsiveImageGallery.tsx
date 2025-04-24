import React from 'react';

interface ImageItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const images: ImageItem[] = [
  {
    src: 'https://cdn.prod.website-files.com/67ae202304d748cdf16daa8d/67ae202304d748cdf16daae2_Webclip.jpg',
    alt: 'Sample Image 1',
    width: 800,
    height: 600,
  },
  {
    src: 'https://cdn.prod.website-files.com/67ae202304d748cdf16daa8d/67ae202304d748cdf16daacb_rocket.png',
    alt: 'Sample Image 2',
    width: 800,
    height: 600,
  },
];

function ResponsiveImageGallery() {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const flexContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '40px',
  };

  const itemStyle = {
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    width: 'calc(50% - 8px)',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <h2>Responsive Image Gallery Examples</h2>

      <section>
        <h3>Problem Example 1: No Size Attributes</h3>
        <p>
          Images with no width or height attributes cause layout shifts during
          loading
        </p>
        <div style={flexContainerStyle}>
          {images.map((image, index) => (
            <div key={`no-size-${index}`} style={itemStyle}>
              <img
                src={image.src}
                alt={image.alt}
                style={{display: 'block', maxWidth: '100%'}}
              />
              <p style={{padding: '10px'}}>
                This text will shift as images load
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Problem Example 2: Partial Size Attributes</h3>
        <p>Images with only width but no height still cause layout shifts</p>
        <div style={flexContainerStyle}>
          {images.map((image, index) => (
            <div key={`partial-size-${index}`} style={itemStyle}>
              <img
                src={image.src}
                alt={image.alt}
                width="100%"
                style={{display: 'block'}}
              />
              <p style={{padding: '10px'}}>
                This text will also shift as images load
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Solution: Proper Size Attributes</h3>
        <p>
          Images with proper width and height attributes prevent layout shifts
        </p>
        <div style={flexContainerStyle}>
          {images.map((image, index) => (
            <div key={`solution-${index}`} style={itemStyle}>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: `${(image.height / image.width) * 100}%`,
                }}>
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
              <p style={{padding: '10px'}}>
                This text stays in place as images load
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ResponsiveImageGallery;
