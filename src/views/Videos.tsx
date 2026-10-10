import React, { useState } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { YoutubeIcon } from '../components/BrandIcons';

export const Videos: React.FC = () => {
  const { videos, trackVideoClick } = useData();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const topicTags = ['All', 'Dividend Investing', 'Financial Statements', 'NGX Basics'];

  const filteredVideos = videos.filter(v => {
    const matchesTag = selectedTag === 'All' || v.topicTag === selectedTag;
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleExternalClick = (id: string, url: string) => {
    trackVideoClick(id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            PSA Lens Free Media Channel
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Financial Literacy & NGX Intelligence Masterclasses
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Watch high-impact video breakdowns right here or subscribe to our official YouTube
            channel for live market commentary and community discussions.
          </p>

          <div className="pt-2">
            <a
              href="https://youtube.com/@psa_investment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>Subscribe on YouTube (@psa_investment)</span>
            </a>
          </div>

          {/* Search Box */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search concepts, dividends, annual reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-800 outline-none focus:border-[#C9A84C] transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tags */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Topic:</span>
          </div>
          {topicTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#0A1F44] text-[#C9A84C]'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Videos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
            <YoutubeIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">No video masterclasses found.</h4>
            <p className="text-xs">Try selecting 'All' or searching for another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredVideos.map(vid => (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}`}
                      title={vid.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-0.5 rounded-full">
                        {vid.topicTag}
                      </span>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {vid.duration}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-xl text-[#0A1F44] leading-snug">
                      {vid.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{vid.description}</p>
                  </div>
                </div>

                <div className="p-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{vid.clicksToYouTube} YouTube interactions</span>

                  <button
                    onClick={() => handleExternalClick(vid.id, vid.youtubeUrl)}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
