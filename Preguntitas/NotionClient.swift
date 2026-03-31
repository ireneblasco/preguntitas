import Foundation

private extension Character {
    /// Trailing moment emoji (aligned with Notion names like `Deep Talk 🧠`).
    var isTrailingMomentEmoji: Bool {
        unicodeScalars.contains { $0.properties.isEmojiPresentation }
    }
}

/// Notion database query + page mapping (matches `utils/notionQuestions.ts`).
enum NotionClient {
    private static let notionVersion = "2022-06-28"

    static func fetchQuestions(apiKey: String, databaseId: String) async throws -> (questions: [Question], momentOptions: [MomentOption]) {
        var pages: [[String: Any]] = []
        var cursor: String?

        repeat {
            var body: [String: Any] = ["page_size": 100]
            if let c = cursor { body["start_cursor"] = c }

            var req = URLRequest(url: URL(string: "https://api.notion.com/v1/databases/\(databaseId)/query")!)
            req.httpMethod = "POST"
            req.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
            req.setValue(notionVersion, forHTTPHeaderField: "Notion-Version")
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (data, response) = try await URLSession.shared.data(for: req)
            guard let http = response as? HTTPURLResponse else {
                throw NSError(domain: "Notion", code: -1)
            }
            guard http.statusCode == 200 else {
                let text = String(data: data, encoding: .utf8) ?? ""
                throw NSError(domain: "Notion", code: http.statusCode, userInfo: [NSLocalizedDescriptionKey: text])
            }

            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] ?? [:]
            let results = json["results"] as? [[String: Any]] ?? []
            pages.append(contentsOf: results)
            let hasMore = json["has_more"] as? Bool ?? false
            cursor = hasMore ? (json["next_cursor"] as? String) : nil
        } while cursor != nil

        let questions = pages.compactMap { mapNotionPage($0) }
        let momentNames = extractUniqueMoments(questions)
        let momentOptions = buildMomentOptions(momentNames)
        return (questions, momentOptions)
    }

    private static func mapNotionPage(_ page: [String: Any]) -> Question? {
        guard let props = page["properties"] as? [String: Any] else { return nil }
        let textEn = extractTitle(props["English"])
        let textEs = extractRichText(props["Spanish"])
        let moment = extractMultiSelect(props["Moment"])
        let pageId = page["id"] as? String ?? ""
        let id = extractUniqueId(props["ID"]) ?? pageId

        if textEn.isEmpty && textEs.isEmpty { return nil }
        return Question(
            id: id,
            textEn: textEn.isEmpty ? textEs : textEn,
            textEs: textEs.isEmpty ? textEn : textEs,
            moment: moment
        )
    }

    private static func extractTitle(_ any: Any?) -> String {
        guard let prop = any as? [String: Any],
              let title = prop["title"] as? [[String: Any]]
        else { return "" }
        return title.compactMap { $0["plain_text"] as? String }.joined()
    }

    private static func extractRichText(_ any: Any?) -> String {
        guard let prop = any as? [String: Any],
              let rich = prop["rich_text"] as? [[String: Any]]
        else { return "" }
        return rich.compactMap { $0["plain_text"] as? String }.joined()
    }

    private static func extractMultiSelect(_ any: Any?) -> [String] {
        guard let prop = any as? [String: Any],
              let items = prop["multi_select"] as? [[String: Any]]
        else { return [] }
        return items.compactMap { $0["name"] as? String }
    }

    private static func extractUniqueId(_ any: Any?) -> String? {
        guard let prop = any as? [String: Any],
              let uid = prop["unique_id"] as? [String: Any],
              let prefix = uid["prefix"] as? String,
              let number = uid["number"]
        else { return nil }
        return "\(prefix)-\(number)"
    }

    private static func extractUniqueMoments(_ questions: [Question]) -> [String] {
        var set = Set<String>()
        for q in questions { q.moment.forEach { set.insert($0) } }
        return set.sorted()
    }

    private static let defaultEmoji = "💬"

    private static func parseMomentNameWithEmoji(_ fullName: String) -> (name: String, emoji: String) {
        var end = fullName.endIndex
        while end > fullName.startIndex {
            let prev = fullName.index(before: end)
            let ch = fullName[prev]
            if ch.isTrailingMomentEmoji {
                end = prev
            } else {
                break
            }
        }
        if end < fullName.endIndex {
            let emoji = String(fullName[end...]).trimmingCharacters(in: .whitespaces)
            let name = String(fullName[..<end]).trimmingCharacters(in: .whitespaces)
            return (name.isEmpty ? fullName : name, emoji.isEmpty ? defaultEmoji : emoji)
        }
        return (fullName, defaultEmoji)
    }

    private static func buildMomentOptions(_ momentNames: [String]) -> [MomentOption] {
        momentNames.map { full in
            let p = parseMomentNameWithEmoji(full)
            return MomentOption(id: full, name: p.name.isEmpty ? full : p.name, emoji: p.emoji)
        }
    }
}
