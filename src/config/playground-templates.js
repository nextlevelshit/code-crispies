/**
 * Playground boilerplate templates
 * Each template provides a starting point for experimentation
 */

export const playgroundTemplates = [
	{
		name: "Card Component",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: #f0f2f5;
  }

  .card {
    max-width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: #1a1a2e;
  }

  .card-text {
    margin: 0;
    color: #666;
    line-height: 1.6;
  }
</style>

<article class="card">
  <img class="card-image" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" alt="">
  <div class="card-content">
    <h2 class="card-title">Card Title</h2>
    <p class="card-text">A simple card component with an image placeholder and text content.</p>
  </div>
</article>`
	},
	{
		name: "Navigation Bar",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    margin: 0;
    padding: 0;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #1a1a2e;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: #ccc;
    text-decoration: none;
  }

  .nav-links a:hover {
    color: white;
  }

  .nav-btn {
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
  }
</style>

<nav class="navbar">
  <span class="logo">Brand</span>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="nav-btn">Sign Up</button>
</nav>`
	},
	{
		name: "Profile Card",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: #f0f2f5;
  }

  .profile {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 1rem;
  }

  .name {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
    color: #1a1a2e;
  }

  .role {
    margin: 0 0 1rem;
    color: #666;
    font-size: 0.9rem;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .stat-value {
    font-weight: bold;
    color: #1a1a2e;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #999;
  }
</style>

<div class="profile">
  <img class="avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="">
  <h2 class="name">Jane Doe</h2>
  <p class="role">UI Designer</p>
  <div class="stats">
    <div>
      <div class="stat-value">142</div>
      <div class="stat-label">Posts</div>
    </div>
    <div>
      <div class="stat-value">8.5k</div>
      <div class="stat-label">Followers</div>
    </div>
    <div>
      <div class="stat-value">284</div>
      <div class="stat-label">Following</div>
    </div>
  </div>
</div>`
	},
	{
		name: "Button Styles",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.2s;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background: #667eea;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-success {
    background: #10b981;
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  .btn-outline {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-ghost {
    background: transparent;
    color: #666;
  }

  .btn-ghost:hover {
    background: #f0f0f0;
  }
</style>

<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>`
	},
	{
		name: "Pricing Table",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    background: #f8f9fa;
  }

  .pricing {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: flex-start;
  }

  .plan {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    width: 140px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .plan.featured {
    background: #667eea;
    color: white;
    transform: scale(1.05);
  }

  .plan-name {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
  }

  .plan-price {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .plan-period {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .plan-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.85rem;
  }

  .plan .plan-btn {
    background: #667eea;
    color: white;
  }

  .plan.featured .plan-btn {
    background: white;
    color: #667eea;
  }
</style>

<div class="pricing">
  <div class="plan">
    <div class="plan-name">Basic</div>
    <div class="plan-price">€9</div>
    <div class="plan-period">per month</div>
    <button class="plan-btn">Get Started</button>
  </div>
  <div class="plan featured">
    <div class="plan-name">Pro</div>
    <div class="plan-price">€29</div>
    <div class="plan-period">per month</div>
    <button class="plan-btn">Get Started</button>
  </div>
  <div class="plan">
    <div class="plan-name">Team</div>
    <div class="plan-price">€99</div>
    <div class="plan-period">per month</div>
    <button class="plan-btn">Get Started</button>
  </div>
</div>`
	},
	{
		name: "Form Layout",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: #f0f2f5;
  }

  .form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 280px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .form-title {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-btn {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 0.5rem;
  }
</style>

<form class="form">
  <h2 class="form-title">Sign In</h2>
  <div class="form-group">
    <label class="form-label" for="email">Email</label>
    <input class="form-input" type="email" id="email" placeholder="you@example.com">
  </div>
  <div class="form-group">
    <label class="form-label" for="password">Password</label>
    <input class="form-input" type="password" id="password" placeholder="••••••••">
  </div>
  <button class="form-btn" type="submit">Sign In</button>
</form>`
	},
	{
		name: "Feature Grid",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: #f8f9fa;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .feature {
    padding: 1.25rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin-bottom: 0.75rem;
  }

  .feature-title {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  .feature-text {
    margin: 0;
    color: #666;
    font-size: 0.85rem;
    line-height: 1.5;
  }
</style>

<div class="features">
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Fast</h3>
    <p class="feature-text">Lightning quick performance.</p>
  </div>
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Secure</h3>
    <p class="feature-text">Enterprise-grade security.</p>
  </div>
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Simple</h3>
    <p class="feature-text">Intuitive interface.</p>
  </div>
</div>`
	},
	{
		name: "Badge Collection",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 2rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 9999px;
  }

  .badge-blue {
    background: #dbeafe;
    color: #1e40af;
  }

  .badge-green {
    background: #dcfce7;
    color: #166534;
  }

  .badge-red {
    background: #fee2e2;
    color: #991b1b;
  }

  .badge-yellow {
    background: #fef3c7;
    color: #92400e;
  }

  .badge-purple {
    background: #f3e8ff;
    color: #7c3aed;
  }

  .badge-outline {
    background: transparent;
    border: 1px solid currentColor;
    color: #666;
  }

  .badge-dot::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    margin-right: 0.5rem;
  }
</style>

<span class="badge badge-blue">New</span>
<span class="badge badge-green">Active</span>
<span class="badge badge-red">Urgent</span>
<span class="badge badge-yellow">Pending</span>
<span class="badge badge-purple">Beta</span>
<span class="badge badge-outline">Default</span>
<span class="badge badge-green badge-dot">Online</span>
<span class="badge badge-red badge-dot">Offline</span>`
	},
	{
		name: "CSS Animation",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
  }

  .animation-demo {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    min-height: 120px;
  }

  .box {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }

  .pulse {
    background: #667eea;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.7; }
  }

  .spin {
    background: #f093fb;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .bounce {
    background: #10b981;
    animation: bounce 0.8s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  .shake {
    background: #f5576c;
    animation: shake 0.4s ease infinite;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
</style>

<div class="animation-demo">
  <div class="box pulse"></div>
  <div class="box spin"></div>
  <div class="box bounce"></div>
  <div class="box shake"></div>
</div>`
	},
	{
		name: "Flexbox Layout",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    margin: 0;
  }

  .layout {
    display: flex;
    gap: 1rem;
  }

  .sidebar {
    width: 120px;
    flex-shrink: 0;
    background: #1a1a2e;
    color: white;
    padding: 1rem;
    border-radius: 8px;
  }

  .main {
    flex: 1;
    background: #f0f2f5;
    padding: 1rem;
    border-radius: 8px;
  }

  .cards {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .card {
    flex: 1;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  h3 { margin: 0 0 0.5rem; font-size: 0.95rem; }
  p { margin: 0; color: #666; font-size: 0.8rem; }
</style>

<div class="layout">
  <aside class="sidebar">
    <h3>Sidebar</h3>
    <p>Fixed width</p>
  </aside>
  <main class="main">
    <h3>Main Content</h3>
    <p>Flexible width</p>
    <div class="cards">
      <div class="card">
        <h3>Card 1</h3>
        <p>Equal</p>
      </div>
      <div class="card">
        <h3>Card 2</h3>
        <p>Equal</p>
      </div>
      <div class="card">
        <h3>Card 3</h3>
        <p>Equal</p>
      </div>
    </div>
  </main>
</div>`
	},
	{
		name: "Social Post",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    background: #fafafa;
  }

  .post {
    max-width: 400px;
    background: white;
    border-radius: 8px;
    border: 1px solid #dbdbdb;
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .username {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .post-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .post-actions {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1rem;
    font-size: 1.5rem;
  }

  .post-actions span {
    cursor: pointer;
  }

  .likes {
    padding: 0 1rem;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .caption {
    padding: 0.5rem 1rem 1rem;
    font-size: 0.9rem;
  }

  .caption strong {
    margin-right: 0.5rem;
  }
</style>

<article class="post">
  <header class="post-header">
    <img class="avatar" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64" alt="">
    <span class="username">creative_studio</span>
  </header>
  <img class="post-image" src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500" alt="">
  <div class="post-actions">
    <span>♡</span>
    <span>💬</span>
    <span>↗</span>
  </div>
  <div class="likes">2,847 likes</div>
  <p class="caption"><strong>creative_studio</strong> Living my best life ✨🌟</p>
</article>`
	},
	{
		name: "Story Highlights",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: white;
  }

  .stories {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    padding: 0.5rem;
  }

  .story {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .story-ring {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    padding: 2px;
  }

  .story-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
  }

  .story.seen .story-ring {
    background: #ccc;
  }

  .story-name {
    font-size: 0.7rem;
    color: #262626;
  }
</style>

<div class="stories">
  <div class="story">
    <div class="story-ring"><img class="story-avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64" alt=""></div>
    <span class="story-name">You</span>
  </div>
  <div class="story">
    <div class="story-ring"><img class="story-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64" alt=""></div>
    <span class="story-name">anna</span>
  </div>
  <div class="story">
    <div class="story-ring"><img class="story-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64" alt=""></div>
    <span class="story-name">mike</span>
  </div>
  <div class="story seen">
    <div class="story-ring"><img class="story-avatar" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64" alt=""></div>
    <span class="story-name">lisa</span>
  </div>
  <div class="story seen">
    <div class="story-ring"><img class="story-avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64" alt=""></div>
    <span class="story-name">alex</span>
  </div>
</div>`
	},
	{
		name: "Like Button",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    gap: 2rem;
  }

  .like-btn {
    font-size: 2.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .like-btn:hover {
    transform: scale(1.1);
  }

  .like-btn:active {
    transform: scale(0.95);
  }

  .like-btn.liked {
    animation: pop 0.3s ease;
  }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  .liked .heart {
    color: #ed4956;
  }

  .like-count {
    font-size: 1.2rem;
    font-weight: 600;
    color: #262626;
  }
</style>

<button class="like-btn" onclick="this.classList.toggle('liked')">
  <span class="heart">♥</span>
</button>

<button class="like-btn liked">
  <span class="heart">♥</span>
</button>

<div class="like-count">1,234 likes</div>`
	},
	{
		name: "Comment Section",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    background: #fafafa;
  }

  .comments {
    max-width: 400px;
    background: white;
    border-radius: 8px;
    padding: 1rem;
  }

  .comment {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .comment-content {
    flex: 1;
  }

  .comment-user {
    font-weight: 600;
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }

  .comment-text {
    font-size: 0.9rem;
    color: #262626;
    line-height: 1.4;
  }

  .comment-meta {
    font-size: 0.75rem;
    color: #8e8e8e;
    margin-top: 0.25rem;
  }

  .comment-input {
    display: flex;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #efefef;
  }

  .comment-input input {
    flex: 1;
    border: none;
    font-size: 0.9rem;
    outline: none;
  }

  .post-btn {
    color: #0095f6;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>

<div class="comments">
  <div class="comment">
    <img class="comment-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64" alt="">
    <div class="comment-content">
      <span class="comment-user">sarah_designs</span>
      <span class="comment-text">This is amazing! 🔥</span>
      <div class="comment-meta">2h · Reply · ♡ 12</div>
    </div>
  </div>
  <div class="comment">
    <img class="comment-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64" alt="">
    <div class="comment-content">
      <span class="comment-user">mike_photo</span>
      <span class="comment-text">Love the colors! What filter did you use?</span>
      <div class="comment-meta">1h · Reply · ♡ 5</div>
    </div>
  </div>
  <div class="comment-input">
    <input type="text" placeholder="Add a comment...">
    <button class="post-btn">Post</button>
  </div>
</div>`
	},
	{
		name: "Notification Badge",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 3rem;
  }

  .icon-btn {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f0f2f5;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 20px;
    height: 20px;
    background: #fe2c55;
    color: white;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .badge.dot {
    width: 12px;
    height: 12px;
    min-width: unset;
    padding: 0;
  }
</style>

<button class="icon-btn">
  🔔
  <span class="badge">3</span>
</button>

<button class="icon-btn">
  💬
  <span class="badge">99+</span>
</button>

<button class="icon-btn">
  ❤️
  <span class="badge dot"></span>
</button>

<button class="icon-btn">
  👤
</button>`
	},
	{
		name: "Emoji Reactions",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
  }

  .reactions {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: white;
    border-radius: 30px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .reaction {
    font-size: 1.75rem;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s, background 0.15s;
  }

  .reaction:hover {
    transform: scale(1.3) translateY(-5px);
    background: #f0f2f5;
  }

  .message {
    background: #0084ff;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    max-width: 250px;
  }

  .reaction-bar {
    display: flex;
    gap: 2px;
    margin-top: 0.5rem;
  }

  .mini-reaction {
    font-size: 0.9rem;
    background: white;
    padding: 2px 6px;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>

<div class="reactions">
  <span class="reaction">👍</span>
  <span class="reaction">❤️</span>
  <span class="reaction">😂</span>
  <span class="reaction">😮</span>
  <span class="reaction">😢</span>
  <span class="reaction">😠</span>
</div>

<div>
  <div class="message">Check out this cool CSS trick!</div>
  <div class="reaction-bar">
    <span class="mini-reaction">👍 12</span>
    <span class="mini-reaction">❤️ 5</span>
  </div>
</div>`
	},
	{
		name: "Bio Section",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    background: #fafafa;
  }

  .bio {
    max-width: 320px;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .bio-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .bio-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
    padding: 3px;
    flex-shrink: 0;
  }

  .bio-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .bio-stats {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #8e8e8e;
  }

  .bio-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .bio-desc {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #262626;
  }

  .bio-link {
    color: #00376b;
    font-weight: 600;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .follow-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 0.6rem;
    background: #0095f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
</style>

<div class="bio">
  <div class="bio-header">
    <div class="bio-avatar"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt=""></div>
    <div class="bio-stats">
      <div class="stat"><div class="stat-num">142</div><div class="stat-label">posts</div></div>
      <div class="stat"><div class="stat-num">8.5K</div><div class="stat-label">followers</div></div>
      <div class="stat"><div class="stat-num">284</div><div class="stat-label">following</div></div>
    </div>
  </div>
  <div class="bio-name">Creative Studio ✨</div>
  <div class="bio-desc">Digital creator | Design tips<br>📍 New York<br>✉️ hello@studio.com</div>
  <a class="bio-link" href="#">linktr.ee/creativestudio</a>
  <button class="follow-btn">Follow</button>
</div>`
	},
	{
		name: "Status Update",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    background: #f0f2f5;
  }

  .status-box {
    max-width: 500px;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .status-input {
    display: flex;
    gap: 0.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e4e6eb;
  }

  .status-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .status-field {
    flex: 1;
    background: #f0f2f5;
    border: none;
    border-radius: 20px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: #65676b;
    cursor: pointer;
  }

  .status-actions {
    display: flex;
    justify-content: space-around;
    padding-top: 0.75rem;
  }

  .status-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    color: #65676b;
  }

  .status-action:hover {
    background: #f0f2f5;
  }

  .status-action span:first-child {
    font-size: 1.25rem;
  }
</style>

<div class="status-box">
  <div class="status-input">
    <img class="status-avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64" alt="">
    <div class="status-field">What's on your mind?</div>
  </div>
  <div class="status-actions">
    <div class="status-action"><span>🎥</span> Live</div>
    <div class="status-action"><span>🖼️</span> Photo</div>
    <div class="status-action"><span>😊</span> Feeling</div>
  </div>
</div>`
	},
	{
		name: "Chat Bubble",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1rem;
    background: #f0f2f5;
  }

  .chat {
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .message {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .message.sent {
    align-self: flex-end;
    background: #0084ff;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message.received {
    align-self: flex-start;
    background: #e4e6eb;
    color: #050505;
    border-bottom-left-radius: 4px;
  }

  .message.received + .message.received,
  .message.sent + .message.sent {
    margin-top: -0.25rem;
  }

  .typing {
    display: flex;
    gap: 4px;
    padding: 1rem;
    background: #e4e6eb;
    border-radius: 18px;
    width: fit-content;
  }

  .typing span {
    width: 8px;
    height: 8px;
    background: #90949c;
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }

  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }
</style>

<div class="chat">
  <div class="message received">Hey! How are you? 👋</div>
  <div class="message sent">I'm good! Just learned some CSS 🎨</div>
  <div class="message sent">Check out this cool effect!</div>
  <div class="message received">Wow that's awesome! 😍</div>
  <div class="message received">Can you teach me?</div>
  <div class="typing"><span></span><span></span><span></span></div>
</div>`
	},
	{
		name: "Accordion FAQ",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: #f8f9fa;
  }

  .faq {
    max-width: 500px;
  }

  .faq h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  details {
    background: white;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  summary {
    padding: 1rem;
    cursor: pointer;
    font-weight: 500;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  summary::after {
    content: "+";
    font-size: 1.25rem;
    color: #667eea;
  }

  details[open] summary::after {
    content: "−";
  }

  details[open] summary {
    border-bottom: 1px solid #eee;
  }

  .answer {
    padding: 1rem;
    color: #666;
    line-height: 1.6;
  }
</style>

<div class="faq">
  <h2>Frequently Asked Questions</h2>
  <details>
    <summary>How do I get started?</summary>
    <div class="answer">Simply create an account and follow our step-by-step guide. It takes less than 5 minutes!</div>
  </details>
  <details>
    <summary>Is there a free trial?</summary>
    <div class="answer">Yes! We offer a 14-day free trial with full access to all features.</div>
  </details>
  <details open>
    <summary>Can I cancel anytime?</summary>
    <div class="answer">Absolutely. No contracts, no commitments. Cancel with one click.</div>
  </details>
</div>`
	},
	{
		name: "Form Validation",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: #f0f2f5;
  }

  .form {
    max-width: 320px;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #667eea;
  }

  input:valid {
    border-color: #10b981;
  }

  input:invalid:not(:placeholder-shown) {
    border-color: #ef4444;
  }

  .hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: -0.75rem;
    margin-bottom: 1rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
  }

  button:hover {
    background: #5a6fd6;
  }
</style>

<form class="form">
  <h2>Create Account</h2>
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="you@example.com" required>

  <label for="password">Password</label>
  <input type="password" id="password" placeholder="Min. 8 characters" minlength="8" required>
  <p class="hint">Must be at least 8 characters</p>

  <label for="age">Age</label>
  <input type="number" id="age" min="18" max="120" placeholder="18+" required>

  <button type="submit">Sign Up</button>
</form>`
	},
	{
		name: "Toggle Switch",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
  }

  .settings {
    max-width: 300px;
  }

  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
  }

  .setting-info h3 {
    margin: 0;
    font-size: 1rem;
  }

  .setting-info p {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: #666;
  }

  .toggle {
    position: relative;
    width: 50px;
    height: 28px;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    inset: 0;
    background: #ccc;
    border-radius: 28px;
    cursor: pointer;
    transition: 0.3s;
  }

  .slider::before {
    content: "";
    position: absolute;
    width: 22px;
    height: 22px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: 0.3s;
  }

  input:checked + .slider {
    background: #667eea;
  }

  input:checked + .slider::before {
    transform: translateX(22px);
  }

  input:focus + .slider {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }
</style>

<div class="settings">
  <div class="setting">
    <div class="setting-info">
      <h3>Dark Mode</h3>
      <p>Use dark theme</p>
    </div>
    <label class="toggle">
      <input type="checkbox" checked>
      <span class="slider"></span>
    </label>
  </div>
  <div class="setting">
    <div class="setting-info">
      <h3>Notifications</h3>
      <p>Get push alerts</p>
    </div>
    <label class="toggle">
      <input type="checkbox">
      <span class="slider"></span>
    </label>
  </div>
  <div class="setting">
    <div class="setting-info">
      <h3>Auto-save</h3>
      <p>Save automatically</p>
    </div>
    <label class="toggle">
      <input type="checkbox" checked>
      <span class="slider"></span>
    </label>
  </div>
</div>`
	},
	{
		name: "CSS Tabs",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 1.5rem;
    background: #f8f9fa;
  }

  .tabs {
    max-width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    overflow: hidden;
  }

  .tabs input[type="radio"] {
    display: none;
  }

  .tab-nav {
    display: flex;
    background: #f0f2f5;
  }

  .tab-nav label {
    flex: 1;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
  }

  .tab-nav label:hover {
    background: #e8eaed;
  }

  .tab-content {
    display: none;
    padding: 1.5rem;
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  #tab1:checked ~ .tab-nav label[for="tab1"],
  #tab2:checked ~ .tab-nav label[for="tab2"],
  #tab3:checked ~ .tab-nav label[for="tab3"] {
    background: white;
    color: #667eea;
    box-shadow: 0 -2px 0 #667eea inset;
  }

  #tab1:checked ~ .content1,
  #tab2:checked ~ .content2,
  #tab3:checked ~ .content3 {
    display: block;
  }
</style>

<div class="tabs">
  <input type="radio" id="tab1" name="tabs" checked>
  <input type="radio" id="tab2" name="tabs">
  <input type="radio" id="tab3" name="tabs">

  <div class="tab-nav">
    <label for="tab1">Overview</label>
    <label for="tab2">Features</label>
    <label for="tab3">Pricing</label>
  </div>

  <div class="tab-content content1">
    <h3>Welcome! 👋</h3>
    <p>This is a CSS-only tab component using radio buttons.</p>
  </div>
  <div class="tab-content content2">
    <h3>Features ✨</h3>
    <p>No JavaScript needed! Pure CSS magic with :checked selector.</p>
  </div>
  <div class="tab-content content3">
    <h3>Pricing 💰</h3>
    <p>It's free! Open source and ready to use.</p>
  </div>
</div>`
	},
	{
		name: "Modal Dialog",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
  }

  .open-btn {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  dialog {
    border: none;
    border-radius: 12px;
    padding: 0;
    max-width: 400px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  }

  dialog::backdrop {
    background: rgba(0,0,0,0.5);
  }

  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .modal-body {
    padding: 1.5rem;
    color: #666;
    line-height: 1.6;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .modal-footer button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-cancel {
    background: #f0f2f5;
    border: none;
  }

  .btn-confirm {
    background: #667eea;
    color: white;
    border: none;
  }
</style>

<button class="open-btn" onclick="document.getElementById('modal').showModal()">
  Open Modal
</button>

<dialog id="modal">
  <div class="modal-header">
    <h2>Confirm Action</h2>
    <button class="close-btn" onclick="this.closest('dialog').close()">×</button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to continue? This action uses the native HTML &lt;dialog&gt; element.</p>
  </div>
  <div class="modal-footer">
    <button class="btn-cancel" onclick="this.closest('dialog').close()">Cancel</button>
    <button class="btn-confirm" onclick="this.closest('dialog').close()">Confirm</button>
  </div>
</dialog>`
	},
	{
		name: "Tooltip",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 3rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip-btn {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .tooltip-text {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 1rem;
    background: #1a1a2e;
    color: white;
    font-size: 0.85rem;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    margin-bottom: 8px;
  }

  .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1a1a2e;
  }

  .tooltip:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
  }

  .tooltip.bottom .tooltip-text {
    bottom: auto;
    top: 100%;
    margin-bottom: 0;
    margin-top: 8px;
  }

  .tooltip.bottom .tooltip-text::after {
    top: auto;
    bottom: 100%;
    border-top-color: transparent;
    border-bottom-color: #1a1a2e;
  }
</style>

<div class="tooltip">
  <button class="tooltip-btn">Hover me</button>
  <span class="tooltip-text">Tooltip on top!</span>
</div>

<div class="tooltip bottom">
  <button class="tooltip-btn">Or me</button>
  <span class="tooltip-text">Tooltip on bottom!</span>
</div>`
	},
	{
		name: "Progress Steps",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    background: #f8f9fa;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    max-width: 500px;
    margin: 0 auto;
    position: relative;
  }

  .progress-steps::before {
    content: "";
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 4px;
    background: #ddd;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .step.completed .step-circle {
    background: #10b981;
    color: white;
  }

  .step.active .step-circle {
    background: #667eea;
    color: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3);
  }

  .step-label {
    font-size: 0.85rem;
    color: #666;
  }

  .step.completed .step-label,
  .step.active .step-label {
    color: #333;
    font-weight: 500;
  }
</style>

<div class="progress-steps">
  <div class="step completed">
    <div class="step-circle">✓</div>
    <span class="step-label">Cart</span>
  </div>
  <div class="step completed">
    <div class="step-circle">✓</div>
    <span class="step-label">Shipping</span>
  </div>
  <div class="step active">
    <div class="step-circle">3</div>
    <span class="step-label">Payment</span>
  </div>
  <div class="step">
    <div class="step-circle">4</div>
    <span class="step-label">Done</span>
  </div>
</div>`
	},
	{
		name: "Dropdown Menu",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-btn {
    padding: 0.75rem 1.25rem;
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dropdown-btn::after {
    content: "▼";
    font-size: 0.7rem;
    transition: transform 0.2s;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    padding: 0.5rem 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.2s;
    margin-top: 4px;
  }

  .dropdown:hover .dropdown-menu,
  .dropdown:focus-within .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .dropdown:hover .dropdown-btn::after {
    transform: rotate(180deg);
  }

  .dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    color: #333;
    text-decoration: none;
    transition: background 0.15s;
  }

  .dropdown-item:hover {
    background: #f0f2f5;
  }

  .dropdown-item.danger {
    color: #ef4444;
  }

  .divider {
    height: 1px;
    background: #eee;
    margin: 0.5rem 0;
  }
</style>

<div class="dropdown">
  <button class="dropdown-btn">Options</button>
  <div class="dropdown-menu">
    <a href="#" class="dropdown-item">👤 Profile</a>
    <a href="#" class="dropdown-item">⚙️ Settings</a>
    <a href="#" class="dropdown-item">❓ Help</a>
    <div class="divider"></div>
    <a href="#" class="dropdown-item danger">🚪 Logout</a>
  </div>
</div>`
	},
	{
		name: "Star Rating",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .rating {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.25rem;
  }

  .rating input {
    display: none;
  }

  .rating label {
    font-size: 2rem;
    color: #ddd;
    cursor: pointer;
    transition: color 0.15s;
  }

  .rating label:hover,
  .rating label:hover ~ label,
  .rating input:checked ~ label {
    color: #fbbf24;
  }

  .rating-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
  }

  .stars {
    color: #fbbf24;
    letter-spacing: 2px;
  }

  .rating-count {
    color: #666;
    font-size: 0.9rem;
  }
</style>

<p>Click to rate:</p>
<div class="rating">
  <input type="radio" id="star5" name="rating" value="5">
  <label for="star5">★</label>
  <input type="radio" id="star4" name="rating" value="4">
  <label for="star4">★</label>
  <input type="radio" id="star3" name="rating" value="3" checked>
  <label for="star3">★</label>
  <input type="radio" id="star2" name="rating" value="2">
  <label for="star2">★</label>
  <input type="radio" id="star1" name="rating" value="1">
  <label for="star1">★</label>
</div>

<div class="rating-display">
  <span class="stars">★★★★☆</span>
  <strong>4.2</strong>
  <span class="rating-count">(128 reviews)</span>
</div>`
	},
	{
		name: "Search Box",
		code: `<style>
  body {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    background: #f0f2f5;
  }

  .search-container {
    max-width: 400px;
  }

  .search-box {
    position: relative;
    margin-bottom: 1rem;
  }

  .search-box input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid transparent;
    border-radius: 12px;
    font-size: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    box-sizing: border-box;
    transition: all 0.2s;
  }

  .search-box input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  .search-box::before {
    content: "🔍";
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
  }

  .search-box input:valid + .clear-btn {
    display: block;
  }

  .clear-btn {
    display: none;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: #ddd;
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1;
  }

  .suggestions {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .suggestion {
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .suggestion:hover {
    background: #f8f9fa;
  }

  .suggestion-icon {
    color: #999;
  }
</style>

<div class="search-container">
  <div class="search-box">
    <input type="search" placeholder="Search..." required>
    <button class="clear-btn">×</button>
  </div>
  <div class="suggestions">
    <div class="suggestion">
      <span class="suggestion-icon">🕐</span> Recent search
    </div>
    <div class="suggestion">
      <span class="suggestion-icon">🔥</span> Trending topic
    </div>
    <div class="suggestion">
      <span class="suggestion-icon">📁</span> In your files
    </div>
  </div>
</div>`
	}
];

/**
 * Get a random template
 * @returns {object} Random template with name and code
 */
export function getRandomTemplate() {
	const index = Math.floor(Math.random() * playgroundTemplates.length);
	return playgroundTemplates[index];
}

/**
 * Get all template names
 * @returns {string[]} Array of template names
 */
export function getTemplateNames() {
	return playgroundTemplates.map((t) => t.name);
}
