import type { Event } from "~/server/zod";

export function exportToCSV(events: Event[]) {
    const rows = [
        ["id", "createdAt", "actorId", "actorName", "actorEmail", "group", "targetId", "targetName", "location", "actionId", "actionName"],
    ];
    for (const event of events) {
        rows.push(
            [event.id, event.createdAt.toString(), event.actorId, event.actorName, event.actorEmail, event.group, event.targetId, event.targetName, event.location, event.action.id, event.action.name]
        );
    }

    const csvContent = rows.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', "export.csv");
    pom.click();
}
