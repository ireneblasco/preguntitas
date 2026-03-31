import SwiftUI

struct QuestionsDeckView: View {
    let momentId: String

    @Environment(\.dismiss) private var dismiss
    @Environment(QuestionStore.self) private var questionStore
    @Environment(FavoritesStore.self) private var favoritesStore
    @Environment(AppLocaleStore.self) private var localeStore

    @State private var questionIndex = 0
    @State private var shuffled: [Question] = []
    @GestureState private var dragOffset: CGSize = .zero

    private var filtered: [Question] {
        questionStore.questions.filter { $0.moment.contains(momentId) }
    }

    private var momentLabel: String {
        questionStore.momentOptions.first(where: { $0.id == momentId })?.name ?? momentId
    }

    private var theme: (bg: Color, text: Color) {
        let idx = questionStore.themeIndex(forMomentId: momentId)
        return AppColors.theme(forMomentIndex: idx)
    }

    private var current: Question? {
        guard !shuffled.isEmpty else { return nil }
        let i = questionIndex % shuffled.count
        return shuffled[i]
    }

    var body: some View {
        ZStack {
            LinearGradient.appBackground
                .ignoresSafeArea()

            VStack(spacing: 0) {
                topBar

                if filtered.isEmpty {
                    emptyState(String(localized: "questions.emptyNoQuestions"))
                } else if let q = current {
                    Spacer(minLength: 24)
                    cardStack(q)
                    Spacer(minLength: 24)
                    controls
                    Text(String(localized: "questions.hint"))
                        .font(.footnote)
                        .foregroundStyle(AppColors.textSecondary)
                        .padding(.bottom, 16)
                } else {
                    emptyState(String(localized: "questions.emptyNoQuestions"))
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .onAppear { reshuffle() }
        .onChange(of: questionStore.questions.count) { _, _ in reshuffle() }
    }

    private var topBar: some View {
        HStack {
            Button {
                dismiss()
            } label: {
                Image(systemName: "chevron.left")
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(AppColors.textPrimary)
            }
            Spacer()
            VStack(spacing: 2) {
                Text(momentLabel)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(AppColors.textPrimary)
            }
            Spacer()
            Color.clear.frame(width: 24, height: 24)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    private func emptyState(_ message: String) -> some View {
        Text(message)
            .font(.body)
            .foregroundStyle(AppColors.textSecondary)
            .multilineTextAlignment(.center)
            .padding()
    }

    private func cardStack(_ q: Question) -> some View {
        let t = theme
        let offset = dragOffset
        return VStack(spacing: 16) {
            Text(questionDisplayText(q, locale: localeStore.locale))
                .font(.system(size: 24, weight: .medium, design: .serif))
                .foregroundStyle(t.text)
                .multilineTextAlignment(.center)
                .padding(28)
                .frame(maxWidth: .infinity)
                .background(t.bg)
                .clipShape(RoundedRectangle(cornerRadius: 24))
                .shadow(color: .black.opacity(0.12), radius: 16, y: 8)
                .rotationEffect(.degrees(Double(offset.width / 20)))
                .offset(x: offset.width, y: 0)
                .gesture(
                    DragGesture()
                        .updating($dragOffset) { value, state, _ in
                            state = value.translation
                        }
                        .onEnded { value in
                            if value.translation.width < -80 {
                                goNext()
                            } else if value.translation.width > 80 {
                                goPrevious()
                            }
                        }
                )
                .padding(.horizontal, 20)

            Button {
                _ = favoritesStore.toggle(q.id)
            } label: {
                Image(systemName: favoritesStore.contains(q.id) ? "heart.fill" : "heart")
                    .font(.title)
                    .foregroundStyle(favoritesStore.contains(q.id) ? Color.red : AppColors.textSecondary)
            }
            .accessibilityLabel(String(localized: "favorites.title"))
        }
    }

    private var controls: some View {
        HStack(spacing: 40) {
            Button(String(localized: "questions.previous")) { goPrevious() }
                .disabled(questionIndex <= 0 || filtered.isEmpty)
            Button(String(localized: "questions.next")) { goNext() }
                .disabled(filtered.isEmpty)
        }
        .padding(.vertical, 12)
    }

    private func reshuffle() {
        shuffled = filtered.shuffled()
        questionIndex = 0
    }

    private func goNext() {
        guard !filtered.isEmpty else { return }
        questionIndex += 1
    }

    private func goPrevious() {
        questionIndex = max(0, questionIndex - 1)
    }
}
