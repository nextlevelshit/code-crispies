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
    background: linear-gradient(135deg, #667eea, #764ba2);
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
  <div class="card-image"></div>
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
    background: linear-gradient(135deg, #f093fb, #f5576c);
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
  <div class="avatar"></div>
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
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  }

  .username {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .post-image {
    width: 100%;
    height: 300px;
    background: linear-gradient(135deg, #667eea, #764ba2);
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
    <div class="avatar"></div>
    <span class="username">creative_studio</span>
  </header>
  <div class="post-image"></div>
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
    background: #ddd;
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
    <div class="story-ring"><div class="story-avatar"></div></div>
    <span class="story-name">You</span>
  </div>
  <div class="story">
    <div class="story-ring"><div class="story-avatar"></div></div>
    <span class="story-name">anna</span>
  </div>
  <div class="story">
    <div class="story-ring"><div class="story-avatar"></div></div>
    <span class="story-name">mike</span>
  </div>
  <div class="story seen">
    <div class="story-ring"><div class="story-avatar"></div></div>
    <span class="story-name">lisa</span>
  </div>
  <div class="story seen">
    <div class="story-ring"><div class="story-avatar"></div></div>
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
    background: linear-gradient(135deg, #667eea, #764ba2);
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
    <div class="comment-avatar"></div>
    <div class="comment-content">
      <span class="comment-user">sarah_designs</span>
      <span class="comment-text">This is amazing! 🔥</span>
      <div class="comment-meta">2h · Reply · ♡ 12</div>
    </div>
  </div>
  <div class="comment">
    <div class="comment-avatar"></div>
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bio-avatar-inner {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
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
    <div class="bio-avatar"><div class="bio-avatar-inner"></div></div>
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
    background: linear-gradient(135deg, #667eea, #764ba2);
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
    <div class="status-avatar"></div>
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
