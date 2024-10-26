<h1>Smartcar API Implementation with Nest.js</h1>

<p>
  This project implements the Smartcar API by consuming the GM API, acting as an adapter to transform and provide a cleaner, consistent interface. The application is built using Nest.js and follows best practices in code quality, error handling, security, and documentation.
</p>

<h2>Getting Started</h2>

<h3>Prerequisites</h3>

<ul>
  <li><strong>Node.js</strong> (version 14 or higher)</li>
  <li><strong>npm</strong> or <strong>Yarn</strong></li>
  <li><strong>Nest.js CLI</strong> (optional but recommended)</li>
</ul>

<h3>Installation</h3>

<ol>
  <li>
    <strong>Clone the Repository</strong>
    <pre><code>git clone https://github.com/your-username/smartcar-api.git
cd smartcar-api
</code></pre>
  </li>
  <li>
    <strong>Install Dependencies</strong>
    <pre><code>npm install
</code></pre>
  </li>
</ol>

<h3>Running the Application</h3>

<p>Start the Nest.js application:</p>

<pre><code>npm run start
</code></pre>

<p>The application will start on port <code>3000</code> by default.</p>

<h2>API Documentation</h2>

<p>The API is documented using Swagger. Access the interactive documentation at:</p>

<pre><code>http://localhost:3000/api
</code></pre>

<h3>Endpoints</h3>

<ul>
  <li><strong>GET /vehicles/:id</strong>: Retrieve vehicle information.</li>
  <li><strong>GET /vehicles/:id/doors</strong>: Get the lock status of each door.</li>
  <li><strong>GET /vehicles/:id/fuel</strong>: Get the fuel level of the vehicle.</li>
  <li><strong>GET /vehicles/:id/battery</strong>: Get the battery level of the vehicle.</li>
  <li><strong>POST /vehicles/:id/engine</strong>: Start or stop the vehicle's engine.</li>
</ul>

<h2>Testing</h2>

<p>
  The application uses Jest for unit testing. Tests are located in the
  <code>src/vehicles/</code> directory.
</p>

<h3>Running Tests</h3>

<p>To run all tests:</p>

<pre><code>npm run test
</code></pre>

<p>
  To run tests in watch mode (re-runs tests on file changes):
</p>

<pre><code>npm run test:watch
</code></pre>

<p>To generate a test coverage report:</p>

<pre><code>npm run test:cov
</code></pre>

<p>
  The coverage report will be generated in the <code>coverage/</code> directory.
</p>

<h2>Technologies Used</h2>

<ul>
  <li><strong>Nest.js</strong></li>
  <li><strong>TypeScript</strong></li>
  <li><strong>Axios</strong></li>
  <li><strong>Swagger</strong></li>
  <li><strong>Class-Validator</strong></li>
  <li><strong>Class-Transformer</strong></li>
</ul>

