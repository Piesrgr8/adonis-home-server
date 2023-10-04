import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import ActivationKey from 'App/Models/ActivationKey'

export default class ActivationKeysController {
    public async generate({ response, auth }: HttpContextContract) {
        const code = Math.floor(10000000 + Math.random() * 90000000).toString()
        const expiresAt = DateTime.now().plus({ minutes: 10 })
        
        if (!auth.user?.isAdmin) {
            return response.status(400).json({ message: 'You do not have permission to generate keys!' })
        }

        const activationKey = new ActivationKey()
        activationKey.code = code
        activationKey.is_active = true
        activationKey.expires_at = expiresAt
        await activationKey.save()

        return response.status(201).json(activationKey)
    }

    public async deactivate({ params, response, auth }: HttpContextContract) {
        const activationKey = await ActivationKey.find(params.id)

        if (!auth.user?.isAdmin) {
            return response.status(400).json({ message: 'You do not have permission to deactivate keys!' })
        }

        if (!activationKey) {
            return response.status(404).json({ message: 'Activation Key does not exist!' })
        }

        if (!activationKey.is_active) {
            return response.status(400).json({ message: 'Activation Key was already used!'})
        }

        activationKey.is_active = false
        await activationKey.save()

        return response.status(200).json({ message: 'Activation Key has been used!'})
    }
}
