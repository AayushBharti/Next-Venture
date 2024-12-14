const Ping = () => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-1">
        <span className="flex size-[11px]">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-700 opacity-75"></span>
          <span className="relative inline-flex size-[11px] rounded-full bg-purple-700"></span>
        </span>
      </div>
    </div>
  )
}
export default Ping
