import React, { useState } from 'react';

const HelpFAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
	{ question: 'How do I add a new link?', answer: 'Click on the "Add" button in the menu and fill out the form.' },
	{ question: 'How do I navigate categories?', answer: 'Use the "Up" button to go up a level, or click on category names to go deeper.' },
	// Add more FAQs as needed
  ];

  const filteredFAQs = faqs.filter(faq =>
	faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
	faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
	<div>
	  <h2>Help / FAQ</h2>
	  <input
		type="text"
		placeholder="Search FAQs"
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
	  />
	  {filteredFAQs.map((faq, index) => (
		<div key={index}>
		  <h3>{faq.question}</h3>
		  <p>{faq.answer}</p>
		</div>
	  ))}
	  <h3>Need more help?</h3>
	  <p>Contact us at <a href="mailto:help@example.com">help@example.com</a></p>
	</div>
  );
};

export default HelpFAQPage;