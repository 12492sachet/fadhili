// Client-side JavaScript to integrate with the backend
// Add this to your existing JavaScript in the HTML file

class PortfolioApp {
  handleFormSubmit(form) {
    const formData = new FormData(form)
    const fields = ["name", "email", "message"]
    let isFormValid = true

    // Validate all required fields
    fields.forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`)
      if (field && !this.validateField(field)) {
        isFormValid = false
      }
    })

    if (isFormValid) {
      const submitBtn = form.querySelector(".submit-btn")
      const originalText = submitBtn.textContent

      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Prepare form data for API
      const contactData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        project: formData.get("project"),
        message: formData.get("message"),
      }

      // Send to backend API
      fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.showSuccessMessage(data.message)
            form.reset()
          } else {
            this.showErrorMessage(data.message || "An error occurred. Please try again.")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          this.showErrorMessage("Network error. Please check your connection and try again.")
        })
        .finally(() => {
          submitBtn.textContent = originalText
          submitBtn.disabled = false
        })
    }
  }

  validateField(field) {
    // Implement your field validation logic here
    return field.value.trim() !== ""
  }

  showSuccessMessage(message) {
    this.showNotification(message, "success")
  }

  showErrorMessage(message) {
    this.showNotification(message, "error")
  }

  showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === "success" ? "✓" : "✗"}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `

    // Add to page
    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }
}
