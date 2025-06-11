
import React, { useEffect, useState } from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { API_URL } from '@/core/config';

const Footer = () => {
  const [counter, setCounter] = useState(0);

  const fetchCounterData = async () => {
    const url = API_URL + "counters/total/portfolio";
    const response = await fetch(url);
    if (!response.ok) {
      setCounter(0);
    }
    const data = await response.json();
    setCounter(data.counter);
  };

  const formatViews = (num: number) => {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  };

  useEffect(() => {
    fetchCounterData();
  }, []);

  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://x.com/NAUTBOL',
      label: 'Follow us on Twitter',
      name: 'Twitter'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/leandrotorressilva/',
      label: 'Connect on LinkedIn',
      name: 'LinkedIn'
    },
    {
      icon: Github,
      href: 'https://github.com/NAUTBOL/',
      label: 'View our GitHub',
      name: 'GitHub'
    }
  ];

  return (
    <footer className="w-full border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Follow our journey and stay updated with the latest tools.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-accent transition-all duration-200 hover:scale-110"
              >
                <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
          <p className="text-lg sm:text-xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Loved by +{formatViews(counter)}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
