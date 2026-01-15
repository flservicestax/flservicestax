import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ChatBubble.css';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/faq.json')
      .then(response => response.json())
      .then(data => {
        setFaqs(data.pageContent.faqs);
      })
      .catch(error => console.error('Error fetching FAQs:', error));
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setActiveQuestion(null); // Reset active question when opening/closing
  };

  const handleQuestionClick = (faq) => {
    setActiveQuestion(faq);
  };

  const goBackToQuestions = () => {
    setActiveQuestion(null);
  };

  const handleLinkClick = (url) => {
    navigate(url);
    setIsOpen(false); // Close the chat bubble after navigation
  };

  return (
    <div className="chat-bubble-container">
      {!isOpen && (
        <button onClick={toggleChat} className="chat-bubble-button" aria-label="Open FAQ chat">
          <MessageSquare size={32} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Frequently Asked Questions</h3>
            <button onClick={toggleChat} aria-label="Close FAQ chat">
              <X size={20} />
            </button>
          </div>
          <div className="chat-content">
            {activeQuestion ? (
              <div className="answer-view">
                <button onClick={goBackToQuestions} className="back-button">
                  &larr; Back to Questions
                </button>
                <h4>{activeQuestion.question}</h4>
                <p>{activeQuestion.answer}</p>
                {activeQuestion.links && activeQuestion.links.length > 0 && (
                  <div className="faq-links">
                    <h5>Related Actions:</h5>
                    <div className="link-buttons">
                      {activeQuestion.links.map((link, index) => (
                        <button
                          key={index}
                          onClick={() => handleLinkClick(link.url)}
                          className="faq-link-button"
                          title={link.alt}
                        >
                          {link.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="question-list">
                <p>Hello! How can we help you today?</p>
                <ul>
                  {faqs.map(faq => (
                    <li key={faq.id} onClick={() => handleQuestionClick(faq)}>
                      {faq.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
