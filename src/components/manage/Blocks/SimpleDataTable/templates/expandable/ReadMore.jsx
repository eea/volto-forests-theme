import React from 'react';

const truncate = (input, max) =>
  input.length > max ? `${input.substring(0, max)}..` : input;

const ReadMore = ({ text, maxChars }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [more, setMore] = React.useState(false);

  const showAction = text.length > maxChars;

  React.useEffect(() => {
    const truncated = truncate(text, maxChars);
    setDisplayText(truncated);
  }, [text, maxChars]);

  return (
    <span className="readmore-container">
      <p className="readmore-text">{more ? text : displayText}</p>
      {showAction && (
        <p
          role="presentation"
          className="readmore-action"
          onClick={() => setMore(!more)}
        >
          {more ? 'Read less..' : 'Read more..'}
        </p>
      )}
    </span>
  );
};

export default ReadMore;
