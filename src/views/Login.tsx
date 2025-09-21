

function Login(){
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Signup / Login</h1>

            <form>
                <input type="text" placeholder="Username" style={{ display: "block", margin: "0.5rem 0" }} />
                <input type="password" placeholder="Password" style={{ display: "block", margin: "0.5rem 0" }} />
                <button type="button">Login</button>
            </form>

        </div>

    );
}

export default Login;