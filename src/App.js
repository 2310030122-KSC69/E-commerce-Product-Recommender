import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Search, Home, User, ShoppingCart } from "lucide-react";
import nikeFlyknit from "./images/rednikeflyknit.jpg";
// NOTE: This single-file React component is a production-ready frontend scaffold
// that looks and behaves like a fun, Instagram-style e-commerce recommender.
// It uses Tailwind CSS classes for styling and Framer Motion for animations.
// It expects the following (recommended) environment:
// - Tailwind CSS configured in the project
// - Optional: shadcn/ui components available for swap-in (not required)
// - An API endpoint for recommendations at /api/recommend (optional — mocked here)

// Default export (React component)
export default function EcomRecommenderApp() {
  // UI state
  const [user, setUser] = useState({ id: "user_123", name: "You", avatar: null });
  const [feed, setFeed] = useState([]); // list of product posts
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // selected product for modal
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const chatRef = useRef(null);

  // on mount: fetch recommended products (mocked)
  useEffect(() => {
    fetchRecommendations(user.id).then((products) => setFeed(products));
  }, []);

  // mock recommendation fetch — in a real app call your DNN backend
  async function fetchRecommendations(userId) {
    // simulate a DNN-powered response
    const sample = [
      {
        id: "p1",
        title: "Crimson Nike Flyknit Sneakers",
        price:  8695,
        img: nikeFlyknit,
        likes: 124,
        comments: [
          { id: 1, user: "Asha", text: "Love this for travel" },
          { id: 2, user: "Rahul", text: "Durable & stylish" },
        ],
        score: 0.93,
      },
      {
        id: "p2",
        title: "Wireless Noise Cancelling Headphones",
        price: 199,
        img: "https://images.unsplash.com/photo-1518444023984-6f0f35fef2d6?w=1000&q=80",
        likes: 334,
        comments: [{ id: 1, user: "Nina", text: "Battery lasts forever" }],
        score: 0.97,
      },
      {
        id: "p3",
        title: "Handmade Ceramic Mug",
        price: 24,
        img: "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=1000&q=80",
        likes: 58,
        comments: [],
        score: 0.78,
      },
      {
        id: "p4",
        title: "Minimalist Sneaker",
        price: 129,
        img: "https://images.unsplash.com/photo-1600180758890-0b5aa8e2c06e?w=1000&q=80",
        likes: 412,
        comments: [{ id: 1, user: "Sai", text: "So comfy!" }],
        score: 0.99,
      },
    ];

    // pretend DNN reordering by score
    return new Promise((res) => setTimeout(() => res(sample.sort((a, b) => b.score - a.score)), 700));
  }

  function toggleLike(id) {
    setFeed((f) => f.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)));
  }

  function addComment(id, text) {
    if (!text.trim()) return;
    setFeed((f) =>
      f.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { id: Date.now(), user: user.name, text }] } : p))
    );
  }

  function handleShare(product) {
    // In production we'd call navigator.share() or create a share link
    alert(`Share link copied for ₹{product.title} — pretend we shared it!`);
  }

  function openChatWith(product) {
    setChatOpen(true);
    setSelected(product);
    // seed chat: miniature recommender assistant reply
    setMessages([{ from: "bot", text: `Hi — I can help with ₹{product.title}. Ask me anything!` }]);
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    const msg = { from: "you", text };
    setMessages((m) => [...m, msg]);
    setTyping("");
    // simulated AI reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: `Good question — here's a quick tip: this product has ₹{Math.round(Math.random() * 100)}% positive signals from similar users.` }]);
    }, 900 + Math.random() * 700);
  }

  function openModal(product) {
    setSelected(product);
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    setSelected(null);
    document.body.style.overflow = "auto";
  }

  // search filter
  const visible = feed.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 antialiased">
      {/* Top nav / header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-yellow-300 p-0.5">
              <div className="bg-white rounded-full px-3 py-1 font-bold">Recom</div>
            </div>
            <div className="hidden sm:block text-slate-500">Personalized picks, powered by DNNs</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                aria-label="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-48 sm:w-64 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-sm placeholder:text-slate-400"
                placeholder="Search products, e.g. headphones"
              />
              <div className="absolute right-3 top-2.5">
                <Search size={16} />
              </div>
            </div>

            <button title="Cart" className="p-2 rounded-full hover:bg-slate-100">
              <ShoppingCart size={18} />
            </button>

            <button onClick={() => alert('Profile menu (stub)')} className="p-2 rounded-full hover:bg-slate-100">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed column */}
          <div className="lg:col-span-2">
            {/* Stories / carousel */}
            <div className="flex items-center gap-4 overflow-x-auto py-2">
              {feed.map((p) => (
                <motion.div key={p.id} whileHover={{ scale: 1.03 }} className="flex-none w-28 text-center">
                  <div className="rounded-full w-20 h-20 overflow-hidden mx-auto border-2 border-pink-300">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs mt-1 truncate">{p.title}</div>
                </motion.div>
              ))}
            </div>

            {/* Product posts (instagram style) */}
            <div className="mt-6 space-y-6">
              {visible.map((product) => (
                <article key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                  <div className="flex items-center px-4 py-3">
                    <div className="rounded-full w-10 h-10 bg-slate-100 mr-3 flex items-center justify-center">R</div>
                    <div>
                      <div className="font-semibold">Recom</div>
                      <div className="text-xs text-slate-500">Suggested • {Math.round(product.score * 100)}% match</div>
                    </div>
                  </div>

                  <div className="cursor-pointer" onClick={() => openModal(product)}>
                    <img src={product.img} alt={product.title} className="w-full h-80 object-cover" />
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleLike(product.id)} className="flex items-center gap-2">
                          <Heart size={18} className={product.liked ? "text-red-500" : "text-slate-600"} />
                          <span>{product.likes}</span>
                        </button>

                        <button onClick={() => setSelected(product)} className="flex items-center gap-2">
                          <MessageCircle size={18} /> <span>{product.comments.length}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={() => handleShare(product)} title="Share" className="p-2 rounded-full hover:bg-slate-100">
                          <Share2 size={16} />
                        </button>
                        <button onClick={() => openChatWith(product)} className="rounded-full px-3 py-1 bg-slate-100 text-sm">Chat</button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="font-semibold">{product.title} <span className="text-slate-500 font-normal">• ₹{product.price}</span></div>
                      <div className="text-sm text-slate-600 mt-2">{product.comments.length > 0 ? product.comments.slice(0, 2).map((c) => `${c.user}: ${c.text}`).join(' — ') : 'No reviews yet — be the first to comment!'}</div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => addComment(product.id, 'Nice product!')} className="text-sm text-slate-500 underline">Quick comment</button>
                      <button onClick={() => alert('Added to wishlist (mock)')} className="text-sm text-slate-500">Save</button>
                    </div>
                  </div>
                </article>
              ))}

              {visible.length === 0 && <div className="text-center py-10 text-slate-500">No products found for “{query}”</div>}
            </div>
          </div>

          {/* Right column: personalized sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Hello, {user.name}</div>
                    <div className="text-xs text-slate-500">Recommended for you</div>
                  </div>
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80'} className="w-12 h-12 rounded-full object-cover" />
                </div>

                <div className="mt-4">
                  <div className="text-xs text-slate-500">Top picks</div>
                  <div className="mt-3 grid gap-3">
                    {feed.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.img} className="w-14 h-14 rounded-md object-cover" />
                        <div>
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="text-xs text-slate-500">₹{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <button onClick={() => alert('Explore more (stub)')} className="w-full rounded-full py-2 bg-pink-500 text-white font-semibold">Explore</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className="text-xs text-slate-500">Why this?</div>
                <div className="mt-2 text-sm">Our DNN analyzes your browsing, purchase and like patterns, then ranks items by relevance. Higher score = better match.</div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex-1">Relevance: {Math.round((feed[0]?.score || 0) * 100)}%</div>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden"><div style={{ width: `₹{Math.round((feed[0]?.score || 0) * 100)}%` }} className="h-2 bg-pink-400" /></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className="text-xs text-slate-500">Quick filters</div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button className="rounded-full px-3 py-1 bg-slate-100 text-sm">All</button>
                  <button className="rounded-full px-3 py-1 bg-slate-100 text-sm">Trending</button>
                  <button className="rounded-full px-3 py-1 bg-slate-100 text-sm">Affordable</button>
                  <button className="rounded-full px-3 py-1 bg-slate-100 text-sm">Gifts</button>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Bottom navigation (mobile) */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 md:hidden">
        <div className="bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-between px-6 py-2 border">
          <button><Home size={18} /></button>
          <button><Search size={18} /></button>
          <button className="bg-pink-500 text-white rounded-full p-3 shadow-lg"><ShoppingCart size={18} /></button>
          <button onClick={() => setChatOpen(true)}><MessageCircle size={18} /></button>
          <button><User size={18} /></button>
        </div>
      </nav>

      {/* Modal for product details / comments */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/40" />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-semibold">{selected.title}</div>
              <button onClick={closeModal} className="px-3 py-1">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4">
                <img src={selected.img} className="w-full h-96 object-cover rounded-xl" />
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold">₹{selected.price}</div>
                <div className="text-sm text-slate-500 mt-2 mb-4">Match: {Math.round(selected.score * 100)}%</div>

                <div className="space-y-3">
                  <button onClick={() => alert('Added to cart (mock)')} className="w-full rounded-full py-2 bg-pink-500 text-white font-semibold">Add to cart</button>
                  <button onClick={() => handleShare(selected)} className="w-full rounded-full py-2 border">Share</button>
                  <button onClick={() => openChatWith(selected)} className="w-full rounded-full py-2 border">Ask about this</button>
                </div>

                <div className="mt-6">
                  <div className="font-semibold">Reviews</div>
                  <div className="mt-3 space-y-2">
                    {selected.comments.length === 0 && <div className="text-sm text-slate-500">No reviews yet — be the first!</div>}
                    {selected.comments.map((c) => (
                      <div key={c.id} className="text-sm border rounded p-2">{c.user}: {c.text}</div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input id="quickComment" placeholder="Write a comment" className="flex-1 rounded-md border px-3 py-2" />
                    <button onClick={() => {
                      const el = document.getElementById('quickComment');
                      addComment(selected.id, el.value);
                      el.value = '';
                    }} className="rounded-md px-3 py-2 bg-pink-500 text-white">Post</button>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}

      {/* Chat drawer */}
      {chatOpen && (
        <div className="fixed right-6 bottom-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold">Assistant — {selected ? selected.title : 'Shop Chat'}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setChatOpen(false); setMessages([]); }} className="px-2">Close</button>
            </div>
          </div>

          <div ref={chatRef} className="p-3 flex-1 overflow-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'you' ? 'text-right' : 'text-left'}>
                <div className={`inline-block rounded-xl px-3 py-2 ${m.from === 'you' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-800'}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <input value={typing} onChange={(e) => setTyping(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(typing)} className="flex-1 border rounded-full px-3 py-2" placeholder="Ask about the product, shipping, or sizing" />
            <button onClick={() => sendMessage(typing)} className="rounded-full bg-pink-500 px-3 py-2 text-white">Send</button>
          </div>
        </div>
      )}

      {/* floating help bubble */}
      <div className="fixed left-6 bottom-6 z-40">
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => alert('Tip: Tap Chat to ask about sizing, delivery & alternatives!')} className="bg-white rounded-full p-3 shadow-lg border">?</motion.button>
      </div>
    </div>
  );
}

// End of file
