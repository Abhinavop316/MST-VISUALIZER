function Head({ algorithm }) {
    return (
        <>
            <div className="items-center justify-between mb-7">
                <h2 className="text-2xl font-semibold text-center">
                    Minimum Spanning Tree Visualizer
                </h2>
                <div className="text-sm text-slate-300">
                    Algorithm:{" "}
                    <span className="font-medium">{algorithm.toUpperCase()}</span>
                </div>
            </div>
        </>
    );
    }

    export default Head;