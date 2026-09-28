import { markdownFiles } from '../content/contentMap'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser'

const TARGET_FOLDER = 'Timeline'

type TimelineFile = {
    path: string
    name: string
    content: string
}

type TimelineGroup = {
    group: string
    date: number
    content: string
}

type ContentGroup = {
    date: number
    content: string
}

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

        // Use the filename as the group name.
        // Spaces are replaced with hyphens for CSS class compatibility.
        const group = file.name.replace(/\s+/g, '-')

        content.forEach(item => {
            // Convert **text** into bold HTML
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

    // Sort every event globally by date.
    // Events from different groups therefore remain interleaved
    // when their dates overlap.
    timeline.sort((a, b) => a.date - b.date)

    // Get every unique group.
    const groups = [...new Set(timeline.map(item => item.group))]

    // Give each group a unique numeric ID.
    // This ID is used to consistently generate its color.
    const groupIds = new Map<string, number>()

    groups.forEach((group, index) => {
        groupIds.set(group, index)
    })

    return (
        <div className="timeline">
            {/* Central timeline */}
            <div className="timeline-line" />

            {timeline.map((item, index) => {
                const groupId = groupIds.get(item.group) ?? 0

                // Alternate events left/right.
                // This only affects visual placement and does NOT
                // affect chronological ordering.
                const side = index % 2 === 0 ? 'left' : 'right'

                return (
                    <div
                        className={`timeline-event timeline-${side}`}
                        key={`${item.group}-${item.date}-${index}`}
                    >
                        {/* Event marker on the central timeline */}
                        <div
                            className="timeline-marker"
                            style={
                                {
                                    '--group-id': groupId,
                                } as React.CSSProperties
                            }
                        />

                        {/* Line connecting the event to the timeline */}
                        <div className="timeline-connector" />

                        {/* Event information */}
                        <div className="timeline-content">
                            {/* Group */}
                            <div
                                className="timeline-group"
                                style={
                                    {
                                        '--group-id': groupId,
                                    } as React.CSSProperties
                                }
                            >
                                {item.group}
                            </div>

                            {/* Date */}
                            <div className="timeline-date">
                                {item.date}
                            </div>

                            {/* Event description */}
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

export default function TimelineIndexPage() {
    const [timelineFiles, setTimelineFiles] = useState<TimelineFile[]>([])

    useEffect(() => {
        async function loadTimelineFiles() {
            const files: TimelineFile[] = []

            for (const [path, loader] of Object.entries(markdownFiles)) {
                const relativePath = path.replace('/src/content/', '')

                if (!relativePath.startsWith(`${TARGET_FOLDER}/`)) {
                    continue
                }

                const content = await loader()
                const name =
                    path.split('/').pop()?.replace(/\.md$/, '') ?? ''

                files.push({
                    path,
                    name,
                    content,
                })
            }

            setTimelineFiles(files)
        }

        loadTimelineFiles()
    }, [])

    return <LoadTimelineData files={timelineFiles} />
}
