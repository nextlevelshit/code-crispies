/**
 * Playground boilerplate templates
 * Each template provides a starting point for experimentation
 */

export const playgroundTemplates = [
	{
		name: "Card Component",
		code: `<style>
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
    <p class="card-text">This is a simple card component with an image placeholder and text content.</p>
  </div>
</article>`
	},
	{
		name: "Navigation Bar",
		code: `<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #1a1a2e;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.2s;
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
    cursor: pointer;
  }
</style>

<nav class="navbar">
  <span class="logo">Brand</span>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="nav-btn">Sign Up</button>
</nav>`
	},
	{
		name: "Profile Card",
		code: `<style>
  body {
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
    width: 100px;
    height: 100px;
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
    gap: 2rem;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .stat-value {
    font-weight: bold;
    color: #1a1a2e;
  }

  .stat-label {
    font-size: 0.8rem;
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
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 2rem;
    font-family: system-ui, sans-serif;
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
    display: flex;
    gap: 1.5rem;
    padding: 2rem;
    background: #f8f9fa;
    justify-content: center;
  }

  .plan {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .plan.featured {
    background: #667eea;
    color: white;
    transform: scale(1.05);
  }

  .plan-name {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
  }

  .plan-price {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .plan-period {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .plan-btn {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
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

<div class="plan">
  <div class="plan-name">Basic</div>
  <div class="plan-price">$9</div>
  <div class="plan-period">per month</div>
  <button class="plan-btn">Get Started</button>
</div>

<div class="plan featured">
  <div class="plan-name">Pro</div>
  <div class="plan-price">$29</div>
  <div class="plan-period">per month</div>
  <button class="plan-btn">Get Started</button>
</div>

<div class="plan">
  <div class="plan-name">Team</div>
  <div class="plan-price">$99</div>
  <div class="plan-period">per month</div>
  <button class="plan-btn">Get Started</button>
</div>`
	},
	{
		name: "Form Layout",
		code: `<style>
  body {
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: #f0f2f5;
  }

  .form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 320px;
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
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 800px;
  }

  .feature {
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin-bottom: 1rem;
  }

  .feature-title {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .feature-text {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
  }
</style>

<div class="features">
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Fast</h3>
    <p class="feature-text">Lightning quick performance for all your needs.</p>
  </div>
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Secure</h3>
    <p class="feature-text">Enterprise-grade security built in from day one.</p>
  </div>
  <div class="feature">
    <div class="feature-icon"></div>
    <h3 class="feature-title">Simple</h3>
    <p class="feature-text">Intuitive interface that anyone can master.</p>
  </div>
</div>`
	},
	{
		name: "Badge Collection",
		code: `<style>
  body {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 2rem;
    font-family: system-ui, sans-serif;
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
    display: flex;
    gap: 2rem;
    padding: 3rem;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .box {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }

  .pulse {
    background: #667eea;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }

  .spin {
    background: #f093fb;
    animation: spin 3s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .bounce {
    background: #10b981;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .shake {
    background: #f5576c;
    animation: shake 0.5s ease infinite;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
</style>

<div class="box pulse"></div>
<div class="box spin"></div>
<div class="box bounce"></div>
<div class="box shake"></div>`
	},
	{
		name: "Flexbox Layout",
		code: `<style>
  body {
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: flex;
    gap: 1rem;
  }

  .sidebar {
    width: 200px;
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

  .card-row {
    display: flex;
    gap: 1rem;
  }

  .card {
    flex: 1;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  h3 { margin: 0 0 0.5rem; }
  p { margin: 0; color: #666; font-size: 0.9rem; }
</style>

<div class="container">
  <div class="row">
    <aside class="sidebar">
      <h3>Sidebar</h3>
      <p>Fixed width</p>
    </aside>
    <main class="main">
      <h3>Main Content</h3>
      <p>Flexible width - grows to fill space</p>
      <div class="card-row" style="margin-top: 1rem;">
        <div class="card">
          <h3>Card 1</h3>
          <p>Equal flex</p>
        </div>
        <div class="card">
          <h3>Card 2</h3>
          <p>Equal flex</p>
        </div>
        <div class="card">
          <h3>Card 3</h3>
          <p>Equal flex</p>
        </div>
      </div>
    </main>
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
