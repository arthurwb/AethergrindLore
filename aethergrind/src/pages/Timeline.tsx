function LoadTimelineData({ files }: { files: TimelineFile[] }) {
    const timeline: TimelineGroup[] = []

    files.forEach(file => {
        const content: ContentGroup[] = file.content
            .split(/(?=:-?\d+:)/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
            .map((item: string) => {
                const match = item.match(/^:(-?\d+):\s*(.*)$/s)

                if (!match) {
                    return null
                }

                return {
                    date: Number(match[1]),
                    content: match[2],
                }
            })
            .filter((item): item is ContentGroup => item !== null)

        const group = file.name.replace(/\s+/g, '-')

        content.forEach(item => {
            item.content = item.content.replace(
                /\*\*(.*?)\*\*/g,
                '<strong>$1</strong>'
            )

            timeline.push({
                group,
                date: item.date,
                content: item.content,
            })
        })
    })

    // Global chronological ordering
    timeline.sort((a, b) => a.date - b.date)

    // Give every group a unique CSS class/index
    const groups = [...new Set(timeline.map(item => item.group))]

    const groupIds = new Map<string, number>()

    groups.forEach((group, index) => {
        groupIds.set(group, index)
    })

    return (
        <div className="timeline">
            <div className="timeline-line" />

            {timeline.map((item, index) => {
                const groupId = groupIds.get(item.group) ?? 0

                // Alternate the event boxes purely for readability.
                // This has NO effect on chronological order.
                const side = index % 2 === 0 ? 'left' : 'right'

                return (
                    <div
                        key={`${item.group}-${item.date}-${index}`}
                        className={`timeline-event timeline-${side}`}
                    >
                        <div
                            className="timeline-marker"
                            style={{
                                '--group-id': groupId,
                            } as React.CSSProperties}
                        />

                        <div className="timeline-connector" />

                        <div className="timeline-content">
                            <div
                                className="timeline-group"
                                style={{
                                    '--group-id': groupId,
                                } as React.CSSProperties}
                            >
                                {item.group}
                            </div>

                            <div className="timeline-date">
                                {item.date}
                            </div>

                            <div className="timeline-description">
                                {parse(item.content)}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
