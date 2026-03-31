import Foundation

/// BCP-47 tags supported by the app (subset matching Settings menu + device resolution).
enum AppLocale: String, CaseIterable, Identifiable {
    case enUS = "en-US"
    case enGB = "en-GB"
    case esES = "es-ES"
    case esMX = "es-MX"
    case pt = "pt"
    case ptBR = "pt-BR"
    case de = "de"
    case it = "it"
    case fr = "fr"

    var id: String { rawValue }

    /// Menu labels (aligned with `LOCALE_DISPLAY_NAMES` in Expo `i18n/index.ts`).
    var displayName: String {
        switch self {
        case .enUS: return "English (US)"
        case .enGB: return "English (UK)"
        case .esES: return "Español (España)"
        case .esMX: return "Español (México)"
        case .pt: return "Português"
        case .ptBR: return "Português (Brasil)"
        case .de: return "Deutsch"
        case .it: return "Italiano"
        case .fr: return "Français"
        }
    }

    static let settingsMenuOrder: [AppLocale] = [
        .enUS, .enGB, .esES, .esMX, .pt, .ptBR, .de, .it, .fr,
    ]

    /// Maps any supported raw tag to a settings-row locale.
    static func settingsMenuRepresentative(for tag: String) -> AppLocale {
        if let exact = AppLocale(rawValue: tag) { return exact }
        let parts = tag.split(separator: "-")
        let lang = parts.first.map(String.init) ?? tag
        switch lang.lowercased() {
        case "en": return .enUS
        case "es": return .esES
        default:
            return AppLocale.settingsMenuOrder.first { $0.rawValue.lowercased().hasPrefix(lang.lowercased()) } ?? .enUS
        }
    }

    /// Which questionnaire language to show (`getTranslationLocale` in Expo).
    var questionUsesSpanish: Bool {
        switch self {
        case .esES, .esMX: return true
        default: return false
        }
    }

    static func resolveDeviceLocale() -> String {
        let preferred = Locale.preferredLanguages.first ?? "en-US"
        return normalizeDeviceTag(preferred)
    }

    private static func normalizeDeviceTag(_ tag: String) -> String {
        let parts = tag.split(separator: "-").map(String.init)
        guard !parts.isEmpty else { return "en-US" }
        if parts.count >= 2 {
            return "\(parts[0].lowercased())-\(parts[1].uppercased())"
        }
        let lang = parts[0].lowercased()
        if lang == "en" { return "en-US" }
        if lang == "es" { return "es-ES" }
        if lang == "pt" { return "pt" }
        if lang == "de" { return "de" }
        if lang == "it" { return "it" }
        if lang == "fr" { return "fr" }
        return "en-US"
    }

    static func initialStoredOrDevice() -> AppLocale {
        if let stored = AppPersistence.getStoredLocaleTag() {
            return settingsMenuRepresentative(for: stored)
        }
        return settingsMenuRepresentative(for: resolveDeviceLocale())
    }

    static func isSupportedTag(_ tag: String) -> Bool {
        settingsMenuOrder.contains { $0.rawValue == tag }
            || settingsMenuRepresentative(for: tag).rawValue == tag
    }
}

func questionDisplayText(_ q: Question, locale: AppLocale) -> String {
    locale.questionUsesSpanish ? q.textEs : q.textEn
}
