import SwiftUI

enum AppColors {
    static let backgroundPrimary = Color(hex: "F8F8F8")
    static let backgroundWarm = Color(hex: "FAF5EF")
    static let backgroundCool = Color(hex: "E9F0F7")

    static let splashBlue = Color(hex: "5AA9E6")
    static let splashYellow = Color(hex: "F9E79F")
    static let splashPink = Color(hex: "F7C6B8")
    static let splashGreen = Color(hex: "A8E6CF")

    static let textPrimary = Color(hex: "1F2937")
    static let textSecondary = Color(hex: "6B7280")

    /// Home / deck / favorites card themes (same order modulo as RN).
    static let cardThemes: [(bg: Color, text: Color)] = [
        (Color(hex: "BEE656"), Color(hex: "3C6112")),
        (Color(hex: "EAC1CC"), Color(hex: "6B2A2D")),
        (Color(hex: "3E614A"), Color(hex: "BEE656")),
        (Color(hex: "FDCF42"), Color(hex: "6B2A2D")),
    ]

    static func theme(forMomentIndex index: Int) -> (bg: Color, text: Color) {
        let i = index >= 0 ? index % cardThemes.count : 0
        return cardThemes[i]
    }
}

extension Color {
    init(hex: String) {
        let sanitized = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: sanitized).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch sanitized.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

extension LinearGradient {
    static var appBackground: LinearGradient {
        LinearGradient(
            colors: [AppColors.backgroundPrimary, AppColors.backgroundWarm, AppColors.backgroundCool],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static var splashBackground: LinearGradient {
        LinearGradient(
            colors: [
                AppColors.splashBlue,
                AppColors.splashYellow,
                AppColors.splashPink,
                AppColors.splashGreen,
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}
