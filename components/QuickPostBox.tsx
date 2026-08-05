"use client";

const QuickPostBox = () => {
    return (
        <form className="quick-post-box w-full">
            <input
                type="text"
                placeholder="Got a question or a win to share?"
                className="bg-dark-100 border-dark-200 placeholder:text-light-200 w-full rounded-[6px] border px-5 py-2.5 text-sm"
            />
        </form>
    )
}

export default QuickPostBox
